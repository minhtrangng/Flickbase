
const express = require('express');
const router = express.Router();

const passport = require('passport');

const CLIENT_URL = "http://localhost:3000/";

const authController = require('../controllers/auth.controller');

// MIDDLEWARE
const auth = require('../middleware/auth');

// get request from abce.com/api/auth/test
router.post('/register', authController.register);
router.post('/signin', authController.signin);
router.get('/isauth', auth(), authController.isauth);
router.post('/loginwithgoogle', authController.loginWithGoogle);
// router.post('/testrole', auth('readAny', 'testrole'), authController.testrole);

////////// GOOGLE LOGIN //////////

// GOOGLE AUTH

router.get('/google', passport.authenticate('google', { scope: 
    ['email', 'profile']
}));

// AUTH CALLBACK
router.get('/google/callback', passport.authenticate('google', {
    successRedirect: '/api/auth/google/callback/success',
    failureRedirect: '/api/auth/google/callback/failure'
}));

// SUCCESS
router.get('/google/callback/success', (request, response) => {
    if(!request.user){
        response.redirect('/api/auth/google/callback/failure')
    }
    console.log(request.user);
    response.send("Welcome " + request.user.email);
});

// FAILURE
router.get('/google/callback/failure', (request, response) => {
    response.send("Error");
    console.log("Error");
})
  

module.exports = router;