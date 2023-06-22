const express = require('express');
const router = express.Router();
const Movie = require('../models/movieModels')
const TVShow = require('../models/tvshowModels')


router.get('/', (req, res) => {
    res.render('majidah')
})

router.get('/home', async (req, res) => {
    try {
        const movies = await Movie.find();
        const tvshows = await TVShow.find()
        res.render('home', {movies})
    } catch (err) {
        console.error('Error retrieving movies', err);
        res.status(500).send('Internal Server Error');
    }
})

module.exports = router