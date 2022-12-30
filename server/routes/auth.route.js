const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');

// MIDDLEWARE
const auth = require('../middleware/auth');

// get request from abce.com/api/auth/test
router.post('/register', authController.register);
router.post('/signin', authController.signin);
router.get('/isauth', auth(), authController.isauth);
// router.post('/testrole', auth('readAny', 'testrole'), authController.testrole);

module.exports = router;