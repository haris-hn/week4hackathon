const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  toggleBlockUser,
  addMovie,
  updateMovie,
  deleteMovie,
  toggleVisibility,
  getStats
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Sab admin routes protected hain
router.use(protect, adminOnly);

// Stats
router.get('/stats', getStats);

// User management
router.get('/users', getAllUsers);
router.put('/users/:id/block', toggleBlockUser);

// Movie management
router.post('/movies', addMovie);
router.put('/movies/:id', updateMovie);
router.delete('/movies/:id', deleteMovie);
router.put('/movies/:id/visibility', toggleVisibility);

module.exports = router;