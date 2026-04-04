require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const Fragrance = require('./models/Fragrance');
const fragranceService = require('./services/fragranceService');

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400';

const fetchWithTimeout = (url, timeout = 5000) => {
  return new Promise((resolve, reject) => {
    const https = require('https');
    const req = https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetchWithTimeout(res.headers.location, timeout).then(resolve).catch(reject);
      } else if (res.statusCode === 200) {
        resolve(true);
      } else {
        reject(new Error(`Status ${res.statusCode}`));
      }
    });
    req.on('error', reject);
    req.setTimeout(timeout, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
};

const validateImage = async (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== 'string') return DEFAULT_IMAGE;
  if (imageUrl.includes('images.unsplash.com') || imageUrl.includes('fragella')) {
    try {
      await fetchWithTimeout(imageUrl, 5000);
      return imageUrl;
    } catch {
      return DEFAULT_IMAGE;
    }
  }
  return imageUrl;
};

const BRANDS_TO_SEED = ['Chanel', 'Dior', 'Creed', 'Tom Ford', 'Yves Saint Laurent', 'Parfums de Marly'];

const seedDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    // 1. Clear existing data (only real data allowed)
    await Product.deleteMany({});
    await Fragrance.deleteMany({});
    console.log('🗑️  Cleared existing products and fragrances');

    // 2. Fetch and Import Real Data from Fragella API
    console.log('🌐 Fetching real data from Fragella API...');
    
    let allFragrances = [];

    for (const brand of BRANDS_TO_SEED) {
      try {
        console.log(`🔍 Fetching fragrances for ${brand}...`);
        const results = await fragranceService.getBrandFragrances(brand, 15);
        
        if (Array.isArray(results)) {
          console.log(`✅ Found ${results.length} fragrances for ${brand}`);
          allFragrances = [...allFragrances, ...results];
        }
      } catch (err) {
        console.error(`❌ Failed to fetch ${brand}:`, err.message);
      }
    }

    if (allFragrances.length === 0) {
      throw new Error('No fragrances could be fetched from the API. Check your API key.');
    }

    // 3. Map and Insert into MongoDB
    console.log(`📦 Importing ${allFragrances.length} real fragrances into Boutique...`);
    
    for (const f of allFragrances) {
      const image = f['Image URL'] || f.image || f.thumbnail;
      const validatedImage = await validateImage(image);
      
      const frag = {
        id: f.id,
        name: f.Name || f.name,
        brand: f.Brand || f.brand,
        image: validatedImage,
        description: f.Description || f.description || `A premium fragrance by ${f.Brand || f.brand}`,
        topNotes: f['Top Notes'] || f.topNotes || [],
        middleNotes: f['Middle Notes'] || f.middleNotes || [],
        baseNotes: f['Base Notes'] || f.baseNotes || [],
        accords: f['Main Accords'] || f.accords || [],
        price: parseFloat(f.Price) || (Math.random() * 150 + 100).toFixed(2),
        category: f.Gender || f.gender || 'Unisex',
        volume: f.Volume || f.volume || '100ml',
        isVisible: true,
        featured: Math.random() > 0.7
      };
      
      try {
        await Fragrance.findOneAndUpdate(
          frag.id ? { id: frag.id } : { name: frag.name, brand: frag.brand },
          frag,
          { upsert: true, new: true }
        );
      } catch (e) {
        // Skip duplicates/errors
      }
    }

    console.log(`✅ Successfully seeded Boutique with real Fragella API data!`);

    // 4. Create admin user if doesn't exist
    const existingAdmin = await User.findOne({ email: 'admin@luxora.com' });
    if (!existingAdmin) {
      await User.create({
        name: 'Luxora Admin',
        email: 'admin@luxora.com',
        password: 'admin123456',
        role: 'admin'
      });
      console.log('✅ Admin user created (admin@luxora.com / admin123456)');
    }

    console.log('🏁 Seeding finished successfully.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

seedDB();
