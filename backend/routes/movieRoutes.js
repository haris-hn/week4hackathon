const express = require('express');
const router = express.Router();
const {
  getAllMovies,
  getMovieById,
  getTrending,
  getNewReleases,
  getMustWatch,
  getGenres,
  addReview
} = require('../controllers/movieController');
const { protect } = require('../middleware/authMiddleware');

// ⚠️ IMPORTANT: /filter/... routes pehle likhne hain /:id se pehle!
router.get('/filter/trending', getTrending);
router.get('/filter/new-releases', getNewReleases);
router.get('/filter/must-watch', getMustWatch);
router.get('/filter/genres', getGenres);

router.get('/', getAllMovies);
router.get('/:id', getMovieById);
router.post('/:id/review', protect, addReview);

module.exports = router;