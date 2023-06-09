const express = require('express');
const router = express.Router();
const TVShow = require('../models/tvshowModels')
const { isAuthenticated, isAdmin } = require('../controllers/authenticationControllers')


router.get('/tvshows', isAuthenticated, async (req, res) => {
    try {
      const tvshows = await TVShow.find();
      res.render('tvshows/tvshows', { tvshows, isAdmin: req.user.isAdmin });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/tvshows/post', isAdmin, (req, res) => {
  res.render('tvshows/new-tvshow')
})

// Define a route to create a new tvshow
router.post('/tvshows', async (req, res) => {
  try {
    const { title, creator, seasons, episodes, image, videos } = req.body;
    const tvshow = new TVShow({ title, creator, seasons, episodes, image, videos });
    await tvshow.save();
    console.log('success', tvshow)
    res.redirect('/tvshows');
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//Edit
router.get('/tvshows/:id/edit', async (req, res) => {
    try {
      const tvshow = await TVShow.findById(req.params.id);
      res.render('tvshows/edit-tvshow', { tvshow });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Update
router.put('/tvshows/:id/update', async (req, res) => {
    try {
      const { title, creator, seasons, episodes, image } = req.body;
      const updatedTVShow = await TVShow.findByIdAndUpdate(
        req.params.id,
        { title, creator, seasons, episodes, image },
        { new: true }
      );
      res.redirect(`/tvshows`);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Delete
router.get('/tvshows/:id/delete', async (req, res) => {
    try {
      const tvshow = await TVShow.findByIdAndRemove(req.params.id);
      res.redirect('/tvshows', { tvshow });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Define a route to view videos for a specific movie
router.get('/tvshows/:id/videos', async (req, res) => {
    try {
      const tvshow = await TVShow.findById(req.params.id);
      if (tvshow) {
        res.render('tvshows/videos', { tvshow });
      } else {
        res.status(404).json({ error: 'TVShow not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;