// Import the necessary modules
const User = require('../models/userModels');
const passport = require('passport')

//Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login')
}

// Define the middleware function
function isAdmin (req, res, next) {
  // Check if the user is authenticated
  if (req.isAuthenticated()) {
    // Retrieve the user from the database
    User.findById(req.user._id)
        .then((user) => {
            if (user.isAdmin) {
                next();
            } else {
                res.status(403).send('Unauthorized')
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Internal Server Error')
        });
    } else {
        res.redirect('/login')
    }
};

module.exports = { isAuthenticated, isAdmin }