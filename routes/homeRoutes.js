const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('majidah')
})

router.get('/home', (req, res) => {
    res.render('home')
})

module.exports = router