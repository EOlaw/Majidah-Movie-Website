const express = require('express');
const router = express.Router();
const TVShow = require('../models/tvShowModel')
const { isAuthenticated } = require('../controllers/authenticationControllers')


router.get('/tvshows', isAuthenticated, async (req, res) => {
    try {
      const tvshows = await TVShow.find();
      res.render('tvshow/tvshows', { tvshows });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Define a route to create a new movie
router.post('/tvshows', async (req, res) => {
  try {
    const { title, creator, seasons, episodes, image, videos } = req.body;
    const tvshow = new TVShow({ title, creator, seasons, episodes, image, videos });
    await tvshow.save();
    res.redirect('/tvshows');
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/tvshows/:id/edit', async (req, res) => {
    try {
      const tvshow = await TVShow.findById(req.params.id);
      res.render('tvshow/edit-tvshow', { tvshow });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/tvshows/:id', async (req, res) => {
    try {
      const { title, creator, seasons, episodes, image, videos } = req.body;
      const updatedTVShow = await TVShow.findByIdAndUpdate(
        req.params.id,
        { title, creator, seasons, episodes, image, videos },
        { new: true }
      );
      res.redirect(`/tvshows/${updatedTVShow._id}`);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/tvshows/:id/delete', async (req, res) => {
    try {
      const tvshow = await TVShow.findById(req.params.id);
      res.render('tvshow/delete-tvshow', { tvshow });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/tvshows/:id', async (req, res) => {
    try {
      await TVShow.findByIdAndDelete(req.params.id);
      res.redirect('/tvshows');
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;