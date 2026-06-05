const Movie = require('../models/Movie');

// @GET /api/movies - Sari movies
const getAllMovies = async (req, res) => {
  try {
    const { type, genre, search } = req.query;
    
    let filter = { isVisible: true };
    
    if (type) filter.contentType = type;
    if (genre) filter.genre = { $in: [genre] };
    if (search) filter.title = { $regex: search, $options: 'i' };

    const movies = await Movie.find(filter);
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/movies/:id - Single movie detail
const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found!' });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/movies/filter/trending - Trending movies
const getTrending = async (req, res) => {
  try {
    const movies = await Movie.find({ 
      isTrending: true, 
      isVisible: true 
    });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/movies/filter/new-releases
const getNewReleases = async (req, res) => {
  try {
    const movies = await Movie.find({ 
      isNewRelease: true, 
      isVisible: true 
    });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/movies/filter/must-watch
const getMustWatch = async (req, res) => {
  try {
    const movies = await Movie.find({ 
      isMustWatch: true, 
      isVisible: true 
    });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/movies/filter/genres - Sare unique genres
const getGenres = async (req, res) => {
  try {
    const genres = await Movie.distinct('genre', { isVisible: true });
    res.json(genres);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @POST /api/movies/:id/review - Review add karo
const addReview = async (req, res) => {
  try {
    const { rating, comment, userName, userLocation } = req.body;
    
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found!' });
    }

    // Check - user ne pehle review diya hua toh nahi?
    const alreadyReviewed = movie.reviews.find(
      r => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ 
        message: 'Already reviewed this movie!' 
      });
    }

    const review = {
      user: req.user._id,
      userName: userName || req.user.name,
      userLocation: userLocation || 'Unknown',
      rating: Number(rating),
      comment
    };

    movie.reviews.push(review);

    // Streamvibe rating update karo
    movie.ratings.streamvibe = (
      movie.reviews.reduce((acc, r) => acc + r.rating, 0) / 
      movie.reviews.length
    ).toFixed(1);

    await movie.save();
    res.status(201).json({ message: 'Review added!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllMovies,
  getMovieById,
  getTrending,
  getNewReleases,
  getMustWatch,
  getGenres,
  addReview
};