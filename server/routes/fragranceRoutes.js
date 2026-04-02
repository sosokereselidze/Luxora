const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  searchFragrances,
  importFragrances,
  getStoredFragrances,
  getStoredFragrance,
  updateStoredFragrance,
  toggleVisibility,
  bulkToggleVisibility,
  toggleFeatured,
  deleteStoredFragrance,
  getStoredBrands,
  getStoredAccords,
  getStoredNotes,
  getSimilarFragrances,
  matchFragrances,
  getBrandFragrances,
  searchNotes,
  searchAccords,
  getUsage
} = require('../controllers/fragranceController');

// Public Fragella API proxy routes
router.get('/search', searchFragrances);
router.get('/similar', getSimilarFragrances);
router.get('/match', matchFragrances);
router.get('/brand/:brandName', getBrandFragrances);
router.get('/notes', searchNotes);
router.get('/accords', searchAccords);
router.get('/usage', getUsage);

// Public stored fragrances (only visible ones)
router.get('/store', getStoredFragrances);
router.get('/store/brands', getStoredBrands);
router.get('/store/accords', getStoredAccords);
router.get('/store/notes', getStoredNotes);
router.get('/store/:id', getStoredFragrance);

// Admin routes - import, manage, visibility
router.post('/import', protect, admin, importFragrances);
router.put('/store/:id', protect, admin, updateStoredFragrance);
router.patch('/store/:id/visibility', protect, admin, toggleVisibility);
router.patch('/store/bulk-visibility', protect, admin, bulkToggleVisibility);
router.patch('/store/:id/featured', protect, admin, toggleFeatured);
router.delete('/store/:id', protect, admin, deleteStoredFragrance);

module.exports = router;
