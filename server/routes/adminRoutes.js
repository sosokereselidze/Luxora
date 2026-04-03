const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  getStats,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getAllReviews,
  deleteReview,
  markOrderPaid,
  getAnalytics
} = require('../controllers/adminController');

// All admin routes require auth + admin role
router.use(protect, admin);

// Dashboard stats
router.get('/stats', getStats);

// Analytics
router.get('/analytics', getAnalytics);

// Users
router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Reviews
router.get('/reviews', getAllReviews);
router.delete('/reviews/:productId/:reviewId', deleteReview);

// Payments
router.put('/orders/:id/pay', markOrderPaid);

module.exports = router;
