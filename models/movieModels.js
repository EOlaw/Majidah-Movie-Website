const mongoose = require('mongoose');

// Define a Movie schema
const movieSchema = new mongoose.Schema({
    title: {
      type: String,
      require: true,
    },
    director: {
      type: String,
      require: true,
    },
    year: {
      type: Number,
      require: true,
    },
    image: {
      type: String,
      require: true,
    },
    videos: {
      type: [String],
      required: true,
    },
    rating: {
      type: String,
      enum: ['1', '2', '3', '4', '5'],
      default: '1',
    },    
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
    createdAt: {
      type: Date,
      default: Date.now,
    }
  });

  
// Create a Movie model
const Movie = mongoose.model('Movie', movieSchema);

//Exporting the movieSchema
module.exports = Movie;