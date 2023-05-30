const mongoose = require('mongoose');

// Define a TV show schema
const tvSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  creator: {
    type: String,
    required: true
  },
  seasons: {
    type: Number,
    required: true
  },
  episodes: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  videos: [String]
});

// Create a TV show model
const TVShow = mongoose.model('TVShow', tvSchema);

// Export the TV show model
module.exports = TVShow;