const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Static uploads (product images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Enable CORS
app.use(cors({
  origin: ['http://localhost:5174', 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/fragrances', require('./routes/fragranceRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Luxora API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`🚀 Luxora Server running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);

  // Ensure the admin user exists
  try {
    const User = require('./models/User');
    const bcrypt = require('bcryptjs');

    let admin = await User.findOne({ 
      $or: [
        { email: 'soso.kereselidze1@gmail.com' },
        { name: 'sosokereselidze0' }
      ]
    });

    if (!admin) {
      admin = await User.create({
        name: 'sosokereselidze0',
        email: 'soso.kereselidze1@gmail.com',
        password: 'admin0',
        role: 'admin'
      });
      console.log('✅ Admin user created: soso.kereselidze1@gmail.com / admin0');
    } else {
      // Ensure role is admin
      if (admin.role !== 'admin') {
        admin.role = 'admin';
        await admin.save();
      }
      console.log('✅ Admin user verified');
    }
  } catch (err) {
    console.error('⚠️  Admin user setup error:', err.message);
  }
});
