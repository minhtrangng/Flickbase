const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');

// MIDDLEWARE
const auth = require('../middleware/auth');

//// ROUTES
router.route('/profile')
// Get user profile
.get(auth('readOwn', 'profile'), userController.profile)
// Update user profile
.patch(auth('updateOwn', 'profile'), userController.updateProfile)

// Update user's email
router.patch('/email', auth('updateOwn', 'profile'), userController.updateUserEmail);

// VERIFY ACCOUNT
router.get('/verify', userController.verifyAccount);

module.exports = router;