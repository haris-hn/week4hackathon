const User = require('../models/User');
const Movie = require('../models/Movie');

// @GET /api/admin/users - Sare users dekho
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @PUT /api/admin/users/:id/block - Block/Unblock user
const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({ 
      message: user.isBlocked ? 'User blocked!' : 'User unblocked!',
      isBlocked: user.isBlocked
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @POST /api/admin/movies - Movie add karo
const addMovie = async (req, res) => {
  try {
    const {
      title, description, genre, releaseYear,
      duration, thumbnail, videoUrl, languages,
      director, music, cast, ratings,
      contentType, isTrending, isNewRelease, isMustWatch
    } = req.body;

    const movie = await Movie.create({
      title, description, genre, releaseYear,
      duration, thumbnail, videoUrl, languages,
      director, music, cast, ratings,
      contentType, isTrending, isNewRelease, isMustWatch
    });

    res.status(201).json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @PUT /api/admin/movies/:id - Movie update karo
const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after'}
    );
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found!' });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @DELETE /api/admin/movies/:id - Movie delete karo
const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found!' });
    }
    res.json({ message: 'Movie deleted!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @PUT /api/admin/movies/:id/visibility - Show/Hide movie
const toggleVisibility = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found!' });
    }
    movie.isVisible = !movie.isVisible;
    await movie.save();
    res.json({ 
      message: movie.isVisible ? 'Movie visible!' : 'Movie hidden!',
      isVisible: movie.isVisible
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/admin/stats - Dashboard stats
const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const blockedUsers = await User.countDocuments({ isBlocked: true });
    const totalMovies = await Movie.countDocuments({ contentType: 'movie' });
    const totalShows = await Movie.countDocuments({ contentType: 'show' });
    const activeSubscriptions = await User.countDocuments({ 
      'subscription.isActive': true 
    });

    res.json({
      totalUsers,
      blockedUsers,
      totalMovies,
      totalShows,
      activeSubscriptions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  toggleBlockUser,
  addMovie,
  updateMovie,
  deleteMovie,
  toggleVisibility,
  getStats
};