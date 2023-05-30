const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/userModel');
const userControllers = require('../controllers/userControllers')


//User route for registration
router.route('/register')
    .get(userControllers.renderRegister)
    .post(userControllers.register)
//User routes for login
router.route('/login')
    .get(userControllers.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}), userControllers.login)
//User route for logout
router.get('/logout', userControllers.logout)


module.exports = router