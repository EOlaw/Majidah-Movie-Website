const express = require('express');
const router = express.Router();
const Movie = require('../models/movieModels')
const User = require('../controllers/userControllers')
const { isAuthenticated, isAdmin } = require('../controllers/authenticationControllers')
const checkUserCommented = require('../controllers/checkComment')


// Define a route to get all movies
router.get('/movies', isAuthenticated, async (req, res) => {
  try {
    const perPage = 36; // Number of movies per page
    const page = parseInt(req.query.page) || 1; // Current page number
    const skip = (page - 1) * perPage;

    const searchQuery = req.query.search || ''; // Get the search query from the request
    const searchRegex = new RegExp(searchQuery, 'i'); // Create a case-insensitive regex pattern

    const query = searchQuery ? { title: searchRegex } : {}; // Use the regex pattern in the query if search query is provided

    const movies = await Movie.find(query)
      .skip(skip)
      .limit(perPage);

    const count = await Movie.countDocuments(query);

    const totalPages = Math.ceil(count / perPage);
    const nextPage = page < totalPages ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    res.render('movies/movies', { movies, nextPage, prevPage, searchQuery, isAdmin: req.user.isAdmin });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/movies/post', isAdmin, (req, res) => {
  res.render('movies/new-movie')
})

  
// Define a route to create a new movie
router.post('/movies', async (req, res) => {
    try {
      const { title, director, year, image, videos } = req.body;
      const movies = new Movie({ title, director, year, image, videos });
      await movies.save();
      //res.status(201).json(movies);
      res.redirect('/movies')
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
});
  
// Define a route to get a specific movie by ID
router.get('/movies/:id/edit', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.render('movies/edit', { movie });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Define a route to update a movie by ID
router.put('/movies/:id/update', async (req, res) => {
    try {
    const { title, director, year, image } = req.body;
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      { title, director, year, image },
      { new: true }
    );
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    console.log(movie)
    res.redirect('/movies');
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

  
  // Define a route to delete a movie by ID
router.get('/movies/:id/delete', async (req, res) => {
    try {
      const movies = await Movie.findByIdAndRemove(req.params.id);
      if (!movies) {
        return res.status(404).json({ error: 'Movie not found' });
      }
      res.redirect('/movies')
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
});
/*
// GET route to display the recommendation page
router.get('/recommendation', async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.render('index', { movies });
  } catch (error) {
    console.error('Error retrieving movies', error);
    res.status(500).send('Internal Server Error');
  }
});
*/
// Define a route to view videos for a specific movie
router.get('/movies/:id/videos', isAuthenticated, async (req, res) => {
  const { id } = req.params;
    try {
      const movies = await Movie.findById(req.params.id);
      if (movies) {
        res.render('movies/videos', { movies });
      } else {
        res.status(404).json({ error: 'Movie not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST route to handle submitting a review/comment
router.post('/movies/:id/review', async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user.id; // Assuming you have user authentication middleware
  try {
    const movies = await Movie.findById(id);
    if (!movies) {
      return res.status(404).send('Movie not found');
    }
    const review = {
      user: userId, // Associate the review with the user's ID
      rating: rating,
      comment: comment,
    };
    movies.reviews.push(review);
    await movies.save();
    res.redirect('/');
  } catch (error) {
    console.error('Error saving review', error);
    res.status(500).send('Internal Server Error');
  }
});

// Update a review
router.put('/movies/:movieId/reviews/:reviewId', async (req, res) => {
  const { movieId, reviewId } = req.params;
  const { rating, comment } = req.body;
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
    review.rating = rating;
    review.comment = comment;
    await movies.save();
    res.redirect('/');
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
    movies.reviews.pull(reviewId); // Remove the review using the pull method
    await movies.save();
    res.redirect('/');
  } catch (error) {
    console.error('Error deleting review', error);
    res.status(500).send('Internal Server Error');
  }
});







module.exports = router;
