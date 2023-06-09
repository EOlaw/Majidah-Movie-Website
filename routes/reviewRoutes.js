const express = require('express');
const router = express.Router();
const Movie = require('./models/movieModels')

// Create a new review
router.post('/movies/:id/reviews', async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user.id; // Assuming you have user authentication middleware

  try {
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).send('Movie not found');
    }

    const review = {
      user: userId,
      rating: rating,
      comment: comment,
    };

    movie.reviews.push(review);
    await movie.save();

    res.redirect(`/movies/${id}`);
  } catch (error) {
    console.error('Error creating review', error);
    res.status(500).send('Internal Server Error');
  }
});

// Update a review
router.put('/movies/:movieId/reviews/:reviewId', async (req, res) => {
  const { movieId, reviewId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user.id; // Assuming you have user authentication middleware

  try {
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).send('Movie not found');
    }

    const review = movie.reviews.id(reviewId);
    if (!review) {
      return res.status(404).send('Review not found');
    }

    // Check if the review belongs to the logged-in user
    if (review.user.toString() !== userId) {
      return res.status(403).send('Unauthorized');
    }

    review.rating = rating;
    review.comment = comment;
    await movie.save();

    res.redirect(`/movies/${movieId}`);
  } catch (error) {
    console.error('Error updating review', error);
    res.status(500).send('Internal Server Error');
  }
});

// Delete a review
router.delete('/movies/:movieId/reviews/:reviewId', async (req, res) => {
  const { movieId, reviewId } = req.params;
  const userId = req.user.id; // Assuming you have user authentication middleware

  try {
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).send('Movie not found');
    }

    const review = movie.reviews.id(reviewId);
    if (!review) {
      return res.status(404).send('Review not found');
    }

    // Check if the review belongs to the logged-in user
    if (review.user.toString() !== userId) {
      return res.status(403).send('Unauthorized');
    }

    review.remove();
    await movie.save();

    res.redirect(`/movies/${movieId}`);
  } catch (error) {
    console.error('Error deleting review', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
