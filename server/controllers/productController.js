const Product = require('../models/Product');
const socketIO = require('../socket');

// @desc    Get all products
// @route   GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const { search, category, brand, minPrice, maxPrice, sort, featured } = req.query;
    let query = {};

    // Search by name or brand
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by brand
    if (brand) {
      query.brand = { $regex: brand, $options: 'i' };
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Filter featured
    if (featured === 'true') {
      query.featured = true;
    }

    // Sort
    let sortOption = {};
    switch (sort) {
      case 'price_asc':
        sortOption = { price: 1 };
        break;
      case 'price_desc':
        sortOption = { price: -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'rating':
        sortOption = { rating: -1 };
        break;
      case 'bestsellers':
        sortOption = { sold: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const products = await Product.find(query).sort(sortOption);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
exports.getProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    
    // Fallback to Fragrance collection if not found in Product collection
    if (!product) {
      const Fragrance = require('../models/Fragrance');
      product = await Fragrance.findById(req.params.id);
    }

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    // If it's a CastError (invalid ID), try searching Fragrance collection by its custom 'id'
    if (error.name === 'CastError') {
      try {
        const Fragrance = require('../models/Fragrance');
        const fragrance = await Fragrance.findOne({ id: req.params.id });
        if (fragrance) return res.json(fragrance);
      } catch (e) {}
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create product (Admin)
// @route   POST /api/products
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update product (Admin)
// @route   PUT /api/products/:id
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all unique brands
// @route   GET /api/products/brands/list
exports.getBrands = async (req, res) => {
  try {
    const brands = await Product.distinct('brand');
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
exports.createProductReview = async (req, res) => {
  try {
    const { rating, comment, productInfo } = req.body;
    const { id } = req.params;
    
    let product;
    
    // Check if ID is a valid MongoDB ObjectID
    const isMongoId = id.match(/^[0-9a-fA-F]{24}$/);
    
    if (isMongoId) {
      product = await Product.findById(id);
    } else {
      // If not a MongoID, search by name/brand combination from productInfo
      product = await Product.findOne({
        $or: [
          { name: productInfo?.name, brand: productInfo?.brand },
          { name: productInfo?.Name, brand: productInfo?.Brand }
        ]
      });
    }

    // If product doesn't exist in our DB, create it from provided info
    if (!product && productInfo) {
      // Normalize category to match enum: ['Men', 'Women', 'Unisex']
      let category = 'Unisex';
      const rawCategory = (productInfo.category || productInfo.Gender || '').toLowerCase();
      if (rawCategory.includes('men') && !rawCategory.includes('women')) {
        category = 'Men';
      } else if (rawCategory.includes('women')) {
        category = 'Women';
      }

      product = await Product.create({
        name: productInfo.name || productInfo.Name,
        brand: productInfo.brand || productInfo.Brand,
        description: productInfo.description || productInfo.Description || 'Fragrance profile from explorer',
        price: Number(productInfo.price || productInfo.Price) || 0,
        image: productInfo.image || productInfo['Image URL'],
        category,
        volume: productInfo.volume || '100ml',
        stock: 50,
      });
    }


    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Product already reviewed' });
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();

      // Emit real-time review update
      try {
        const io = socketIO.getIO();
        // Emit to both original ID and MongoDB ID rooms
        const rooms = [`product-${product._id}`];
        if (id !== product._id.toString()) {
          rooms.push(`product-${id}`);
        }
        
        rooms.forEach(room => {
          io.to(room).emit('new-review', {
            productId: id, // Original ID from request
            mongoProductId: product._id, // Actual DB ID
            review: product.reviews[product.reviews.length - 1],
            numReviews: product.numReviews,
            rating: product.rating
          });
        });
      } catch (err) {

        console.error('Socket error in review:', err.message);
      }

      res.status(201).json({ 
        message: 'Review added', 
        productId: product._id // Return the actual DB ID
      });
    } else {
      res.status(404).json({ message: 'Product not found and no info provided for creation' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


