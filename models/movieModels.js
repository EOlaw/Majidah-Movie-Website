const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  director: { type: String, required: true },
  year: { type: Number, required: true },
  image: { type: String, required: true },
  videos: { type: [String], required: true },
  rating: { type: String, enum: ['1', '2', '3', '4', '5'], default: '1' },
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      rating: {
        type: String,
        enum: ['1', '2', '3', '4', '5'],
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  createdAt: { type: Date, default: Date.now }
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
