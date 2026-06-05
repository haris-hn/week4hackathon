const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: String,
  userLocation: String,
  rating: { type: Number, min: 1, max: 5 },
  comment: String
}, { timestamps: true });

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  genre: [String],
  releaseYear: Number,
  duration: String,
  thumbnail: String,
  videoUrl: String,
  languages: [String],
  director: { name: String, photo: String, from: String },
  music: { name: String, photo: String, from: String },
  cast: [{ name: String, photo: String }],
  ratings: {
    imdb: { type: Number, default: 0 },
    streamvibe: { type: Number, default: 0 }
  },
  contentType: {
    type: String,
    enum: ['movie', 'show'],
    required: true
  },
  isTrending: { type: Boolean, default: false },
  isNewRelease: { type: Boolean, default: false },
  isMustWatch: { type: Boolean, default: false },
  isVisible: { type: Boolean, default: true },
  reviews: [reviewSchema]
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);