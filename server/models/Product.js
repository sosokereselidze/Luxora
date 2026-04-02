const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
}, {
  timestamps: true
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: 100
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: 1000
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400'
  },
  category: {
    type: String,
    enum: ['Men', 'Women', 'Unisex'],
    default: 'Unisex'
  },
  volume: {
    type: String,
    default: '100ml'
  },
  stock: {
    type: Number,
    required: true,
    default: 50,
    min: 0
  },
  reviews: [reviewSchema],
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Text index for search
productSchema.index({ name: 'text', brand: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
