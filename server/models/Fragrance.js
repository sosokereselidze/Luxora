const mongoose = require('mongoose');

const fragranceSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    sparse: true
  },
  name: {
    type: String,
    required: [true, 'Fragrance name is required'],
    trim: true
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    min: 0,
    default: 0
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400'
  },
  category: {
    type: String,
    enum: ['Men', 'Women', 'Unisex', 'Unknown'],
    default: 'Unisex'
  },
  volume: {
    type: String,
    default: '100ml'
  },
  topNotes: [String],
  middleNotes: [String],
  baseNotes: [String],
  accords: [String],
  isVisible: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  stock: {
    type: Number,
    default: 10
  },
  sold: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Text index for search
fragranceSchema.index({ name: 'text', brand: 'text', description: 'text' });

module.exports = mongoose.model('Fragrance', fragranceSchema);
