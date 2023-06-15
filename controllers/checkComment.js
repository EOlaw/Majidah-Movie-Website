const User = require('../models/userModels');
const Movie = require('../models/movieModels')


// Middleware to check if user has commented before
module.exports.checkUserCommented = async (req, res, next) => {
    const { movieId, reviewId } = req.params;
    const userId = req.user.id; // Assuming you have user authentication middleware
    try {
      const movies = await Movie.findById(movieId);
      if (!movies) {
        return res.status(404).send('Movie not found');
      }
      const review = movies.reviews.id(reviewId);
      if (!review) {
        return res.status(404).send('Review not found');
      }
      // Check if the review belongs to the logged-in user
      if (review.user.toString() !== userId) {
        return res.status(403).send('Unauthorized');
      }
      // User has commented before, proceed to the update or delete route
      next();
    } catch (error) {
      console.error('Error checking user comment', error);
      res.status(500).send('Internal Server Error');
    }
  };
  