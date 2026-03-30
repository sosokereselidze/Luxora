const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
require('dotenv').config();

const perfumes = [
  {
    name: 'Midnight Orchid',
    brand: 'Luxora',
    description: 'A captivating blend of rare black orchid, velvet musk, and dark vanilla. This enigmatic fragrance unfolds with mysterious depth, revealing layers of exotic florals intertwined with smoky amber. Perfect for evening occasions when you want to leave an unforgettable impression.',
    price: 189.99,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500',
    category: 'Women',
    volume: '100ml',
    stock: 45,
    rating: 4.8,
    numReviews: 124,
    featured: true
  },
  {
    name: 'Royal Oud',
    brand: 'Luxora',
    description: 'An opulent composition of premium aged oud wood, saffron, and rose absolute. This regal fragrance commands attention with its rich, woody base notes complemented by spicy cardamom and a hint of leather. A signature scent for the distinguished individual.',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1594035910387-fea081ae7aec?w=500',
    category: 'Unisex',
    volume: '75ml',
    stock: 30,
    rating: 4.9,
    numReviews: 89,
    featured: true
  },
  {
    name: 'Velvet Rose',
    brand: 'Maison Royale',
    description: 'A luxurious bouquet of Bulgarian rose petals, peony, and white jasmine, resting on a bed of cashmere musk and sandalwood. This romantic fragrance captures the essence of a secret garden at twilight, delicate yet deeply sensual.',
    price: 165.00,
    image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=500',
    category: 'Women',
    volume: '50ml',
    stock: 60,
    rating: 4.7,
    numReviews: 201,
    featured: true
  },
  {
    name: 'Noir Absolute',
    brand: 'Luxora',
    description: 'Bold and unapologetic, Noir Absolute opens with explosive bergamot and pink pepper, before settling into a heart of iris and violet leaf. The dry-down reveals a sophisticated blend of dark amber, tonka bean, and aged vetiver.',
    price: 219.99,
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500',
    category: 'Men',
    volume: '100ml',
    stock: 35,
    rating: 4.6,
    numReviews: 156,
    featured: true
  },
  {
    name: 'Amber Elixir',
    brand: 'Maison Royale',
    description: 'A warm, enveloping fragrance built around precious amber resin, vanilla bourbon, and benzoin. Enriched with notes of cinnamon bark and dried fruits, this elixir wraps you in a golden aura of comfort and sophistication.',
    price: 175.00,
    image: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=500',
    category: 'Unisex',
    volume: '100ml',
    stock: 50,
    rating: 4.5,
    numReviews: 178,
    featured: false
  },
  {
    name: 'Santal Dreams',
    brand: 'Élysée',
    description: 'Creamy Australian sandalwood meets coconut milk and cardamom in this dreamy composition. A modern take on the sandalwood fragrance family, with subtle hints of iris and violet creating an ethereal quality that lingers beautifully on skin.',
    price: 195.00,
    image: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=500',
    category: 'Unisex',
    volume: '75ml',
    stock: 40,
    rating: 4.7,
    numReviews: 95,
    featured: true
  },
  {
    name: 'Citrus Imperiale',
    brand: 'Élysée',
    description: 'A vibrant burst of Sicilian bergamot, yuzu, and blood orange, balanced with neroli and petitgrain. The fresh opening transitions into a sophisticated heart of tea rose and jasmine, finishing with white cedar and musk.',
    price: 145.00,
    image: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=500',
    category: 'Men',
    volume: '100ml',
    stock: 55,
    rating: 4.4,
    numReviews: 132,
    featured: false
  },
  {
    name: 'Iris Noir',
    brand: 'Maison Royale',
    description: 'A powdery, sophisticated fragrance centered around Florentine iris butter and violet root. Accented with cold suede and incense smoke, this artistic creation blurs the line between classic elegance and modern minimalism.',
    price: 235.00,
    image: 'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=500',
    category: 'Women',
    volume: '50ml',
    stock: 25,
    rating: 4.8,
    numReviews: 67,
    featured: true
  },
  {
    name: 'Tobacco & Vanille',
    brand: 'Luxora',
    description: 'Rich, warm, and intoxicating. Premium tobacco leaf infused with vanilla bean, tonka, and dried fruits. A touch of cocoa absolute and spicy clove creates a cozy, addictive quality thats perfect for autumn and winter evenings.',
    price: 285.00,
    image: 'https://images.unsplash.com/photo-1547887538-047f814bfb64?w=500',
    category: 'Unisex',
    volume: '100ml',
    stock: 20,
    rating: 4.9,
    numReviews: 243,
    featured: false
  },
  {
    name: 'Ocean Breeze',
    brand: 'Élysée',
    description: 'Fresh marine notes blended with sea salt, driftwood, and white tea. An invigorating aquatic composition that captures the essence of Mediterranean coast. Clean, crisp, and effortlessly elegant for everyday luxury.',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500',
    category: 'Men',
    volume: '100ml',
    stock: 70,
    rating: 4.3,
    numReviews: 298,
    featured: false
  },
  {
    name: 'Pink Champagne',
    brand: 'Maison Royale',
    description: 'Effervescent and joyful, this fragrance sparkles with pink champagne accord, wild strawberry, and litchi. A base of white musk and blonde wood keeps it grounded while maintaining its celebratory spirit. Perfect for brunch and daytime events.',
    price: 155.00,
    image: 'https://images.unsplash.com/photo-1608528577891-eb055944f2e7?w=500',
    category: 'Women',
    volume: '75ml',
    stock: 45,
    rating: 4.6,
    numReviews: 188,
    featured: false
  },
  {
    name: 'Mystic Musk',
    brand: 'Luxora',
    description: 'An ethereal white musk fragrance elevated with crystalline aldehydes and sheer jasmine. This skin-scent technology formula melds with your natural chemistry, creating a unique olfactory fingerprint that is distinctly yours.',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=500',
    category: 'Unisex',
    volume: '100ml',
    stock: 38,
    rating: 4.5,
    numReviews: 112,
    featured: true
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');

    // Clear existing data
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert perfumes
    await Product.insertMany(perfumes);
    console.log(`✅ Seeded ${perfumes.length} perfumes successfully!`);

    // Create admin user if doesn't exist
    const existingAdmin = await User.findOne({ email: 'admin@luxora.com' });
    if (!existingAdmin) {
      await User.create({
        name: 'Luxora Admin',
        email: 'admin@luxora.com',
        password: 'admin123456',
        role: 'admin'
      });
      console.log('✅ Admin user created (admin@luxora.com / admin123456)');
    } else {
      console.log('Admin user already exists');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

seedDB();
