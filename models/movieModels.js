const mongoose = require('mongoose');


// Define a Movie schema
const movieSchema = new mongoose.Schema({
    title: String,
    director: String,
    year: Number,
    image: String,
    videos: [String],
  });

  
// Create a Movie model
const Movie = mongoose.model('Movie', movieSchema);

//Exporting the movieSchema
module.exports = Movie;