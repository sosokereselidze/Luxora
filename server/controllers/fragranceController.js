const fragranceService = require('../services/fragranceService');
const Fragrance = require('../models/Fragrance');

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400';

const validateImage = async (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== 'string') return DEFAULT_IMAGE;
  return imageUrl;
};

// ---------------------------------------------------------
// PUBLIC FRAGELLA API PROXY ROUTES
// ---------------------------------------------------------

// @desc    Search fragrances from external API
// @route   GET /api/fragrances/search
exports.searchFragrances = async (req, res) => {
  try {
    const { search, limit } = req.query;
    if (!search || search.length < 3) {
      return res.status(400).json({ message: 'Search query must be at least 3 characters' });
    }
    const results = await fragranceService.searchFragrances(search, parseInt(limit) || 10);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get similar fragrances from external API
// @route   GET /api/fragrances/similar
exports.getSimilarFragrances = async (req, res) => {
  try {
    const { name, limit } = req.query;
    if (!name) {
      return res.status(400).json({ message: 'Fragrance name is required' });
    }
    const results = await fragranceService.getSimilarFragrances(name, parseInt(limit) || 10);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Match fragrances by accords/notes from external API
// @route   GET /api/fragrances/match
exports.matchFragrances = async (req, res) => {
  try {
    const { accords, top, middle, base, general, limit } = req.query;
    const results = await fragranceService.matchFragrances({
      accords, top, middle, base, general, limit: parseInt(limit) || 10
    });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get fragrances by brand from external API
// @route   GET /api/fragrances/brand/:brandName
exports.getBrandFragrances = async (req, res) => {
  try {
    const { brandName } = req.params;
    const { limit } = req.query;
    const results = await fragranceService.getBrandFragrances(brandName, parseInt(limit) || 10);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search fragrance notes from external API
// @route   GET /api/fragrances/notes
exports.searchNotes = async (req, res) => {
  try {
    const { search, limit } = req.query;
    if (!search || search.length < 2) {
      return res.status(400).json({ message: 'Search query must be at least 2 characters' });
    }
    const results = await fragranceService.searchNotes(search, parseInt(limit) || 10);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search fragrance accords from external API
// @route   GET /api/fragrances/accords
exports.searchAccords = async (req, res) => {
  try {
    const { search, limit } = req.query;
    if (!search || search.length < 2) {
      return res.status(400).json({ message: 'Search query must be at least 2 characters' });
    }
    const results = await fragranceService.searchAccords(search, parseInt(limit) || 10);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get API usage stats
// @route   GET /api/fragrances/usage
exports.getUsage = async (req, res) => {
  try {
    const usage = await fragranceService.getUsage();
    res.json(usage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ---------------------------------------------------------
// LOCAL FRAGRANCE STORAGE (MONGODB) ROUTES
// ---------------------------------------------------------

// @desc    Get stored fragrances from MongoDB with advanced filters
// @route   GET /api/fragrances/store
exports.getStoredFragrances = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const keyword = req.query.keyword || '';
    const brand = req.query.brand || '';
    const category = req.query.category || '';
    const minPrice = parseFloat(req.query.minPrice);
    const maxPrice = parseFloat(req.query.maxPrice);
    const volume = req.query.volume || '';
    const accord = req.query.accord || '';
    const note = req.query.note || '';
    const onlyVisible = req.query.admin === 'true' ? false : true;

    const query = {};
    
    if (onlyVisible) query.isVisible = true;
    if (brand) query.brand = brand;
    if (category) query.category = category;
    
    // Price Range
    if (!isNaN(minPrice) || !isNaN(maxPrice)) {
      query.price = {};
      if (!isNaN(minPrice)) query.price.$gte = minPrice;
      if (!isNaN(maxPrice)) query.price.$lte = maxPrice;
    }

    // Volume (Partial match since some might be 100ml, others 100 ML)
    if (volume) {
      query.volume = { $regex: volume, $options: 'i' };
    }

    // Accords (Exact match in array)
    if (accord) {
      query.accords = accord;
    }

    // Notes (Check in top, middle, or base)
    if (note) {
      query.$or = [
        { topNotes: { $regex: note, $options: 'i' } },
        { middleNotes: { $regex: note, $options: 'i' } },
        { baseNotes: { $regex: note, $options: 'i' } }
      ];
    }

    // Keyword search
    if (keyword) {
      if (query.$or) {
        // If we already have an $or (from notes), we wrap it
        const currentOr = query.$or;
        delete query.$or;
        query.$and = [
          { $or: currentOr },
          { $or: [
            { name: { $regex: keyword, $options: 'i' } },
            { brand: { $regex: keyword, $options: 'i' } },
            { description: { $regex: keyword, $options: 'i' } }
          ]}
        ];
      } else {
        query.$or = [
          { name: { $regex: keyword, $options: 'i' } },
          { brand: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } }
        ];
      }
    }

    // Sort Option
    let sortOption = { createdAt: -1 };
    if (req.query.sort === 'bestsellers') {
      sortOption = { sold: -1 };
    } else if (req.query.sort === 'price_asc') {
      sortOption = { price: 1 };
    } else if (req.query.sort === 'price_desc') {
      sortOption = { price: -1 };
    }

    const total = await Fragrance.countDocuments(query);
    const fragrances = await Fragrance.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      fragrances,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Import/Add fragrances from external search into MongoDB
// @route   POST /api/fragrances/import
exports.importFragrances = async (req, res) => {
  try {
    const { fragrances } = req.body;
    if (!Array.isArray(fragrances) || fragrances.length === 0) {
      return res.status(400).json({ message: 'No fragrances provided to import' });
    }

    const importResults = await Promise.all(fragrances.map(async (f) => {
      const name = f.Name || f.name;
      const brand = f.Brand || f.brand;
      const externalId = f.id;
      const rawImage = f['Image URL'] || f.image || f.thumbnail || f.imageUrl;
      const image = await validateImage(rawImage);
      
      const filter = externalId ? { id: externalId } : { name, brand };
      
      const update = {
        id: externalId,
        name: name,
        brand: brand,
        image: image,
        description: f.Description || f.description || '',
        topNotes: f['Top Notes'] || f.topNotes || [],
        middleNotes: f['Middle Notes'] || f.middleNotes || f['Heart Notes'] || [],
        baseNotes: f['Base Notes'] || f.baseNotes || [],
        accords: f['Main Accords'] || f.accords || [],
        price: parseFloat(f.Price) || f.price || (Math.random() * 150 + 100).toFixed(2),
        category: f.Gender || f.gender || f.category || 'Unisex',
        volume: f.Volume || f.volume || '100ml'
      };

      return Fragrance.findOneAndUpdate(filter, update, { upsert: true, new: true });
    }));

    res.json({ message: `Successfully imported ${importResults.length} fragrances`, count: importResults.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle fragrance visibility
// @route   PATCH /api/fragrances/store/:id/visibility
exports.toggleVisibility = async (req, res) => {
  try {
    const fragrance = await Fragrance.findById(req.params.id);
    if (!fragrance) return res.status(404).json({ message: 'Fragrance not found' });

    fragrance.isVisible = !fragrance.isVisible;
    await fragrance.save();

    res.json({ message: `Fragrance visibility toggled to ${fragrance.isVisible}`, isVisible: fragrance.isVisible });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Bulk toggle fragrance visibility
// @route   PATCH /api/fragrances/store/bulk-visibility
exports.bulkToggleVisibility = async (req, res) => {
  try {
    const { ids, isVisible } = req.body;
    if (!Array.isArray(ids)) return res.status(400).json({ message: 'IDs array required' });

    await Fragrance.updateMany({ _id: { $in: ids } }, { $set: { isVisible } });
    res.json({ message: `Updated visibility for ${ids.length} fragrances` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle featured status
// @route   PATCH /api/fragrances/store/:id/featured
exports.toggleFeatured = async (req, res) => {
  try {
    const fragrance = await Fragrance.findById(req.params.id);
    if (!fragrance) return res.status(404).json({ message: 'Fragrance not found' });

    fragrance.featured = !fragrance.featured;
    await fragrance.save();

    res.json({ message: `Fragrance featured status toggled to ${fragrance.featured}`, featured: fragrance.featured });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get fragrance by ID from MongoDB
// @route   GET /api/fragrances/store/:id
exports.getStoredFragrance = async (req, res) => {
  try {
    const fragrance = await Fragrance.findById(req.params.id);
    if (!fragrance) return res.status(404).json({ message: 'Fragrance not found' });
    res.json(fragrance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update fragrance in MongoDB
// @route   PUT /api/fragrances/store/:id
exports.updateStoredFragrance = async (req, res) => {
  try {
    if (req.body.image) {
      req.body.image = await validateImage(req.body.image);
    }
    const fragrance = await Fragrance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!fragrance) return res.status(404).json({ message: 'Fragrance not found' });
    res.json(fragrance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete fragrance from MongoDB
// @route   DELETE /api/fragrances/store/:id
exports.deleteStoredFragrance = async (req, res) => {
  try {
    const fragrance = await Fragrance.findByIdAndDelete(req.params.id);
    if (!fragrance) return res.status(404).json({ message: 'Fragrance not found' });
    res.json({ message: 'Fragrance deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all unique brands in stored fragrances
// @route   GET /api/fragrances/store/brands
exports.getStoredBrands = async (req, res) => {
  try {
    const brands = await Fragrance.distinct('brand');
    res.json(brands.sort());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all unique accords in stored fragrances
// @route   GET /api/fragrances/store/accords
exports.getStoredAccords = async (req, res) => {
  try {
    const accords = await Fragrance.distinct('accords');
    res.json(accords.sort());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all unique notes in stored fragrances
// @route   GET /api/fragrances/store/notes
exports.getStoredNotes = async (req, res) => {
  try {
    const top = await Fragrance.distinct('topNotes');
    const mid = await Fragrance.distinct('middleNotes');
    const base = await Fragrance.distinct('baseNotes');
    const allNotes = [...new Set([...top, ...mid, ...base])];
    res.json(allNotes.sort());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
