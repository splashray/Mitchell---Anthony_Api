//The `authRouter.js` file will contain our authentication router, which will handle authentication-related endpoints.

// authRouter.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validationMiddleware');

// Register Route
router.post('/register', validateRegister, authController.register);

// Login Route
router.post('/login', validateLogin, authController.login);

// Google Auth Route
router.post('/google-auth', authController.googleAuth);

// Logout Route
router.post('/logout', authController.logout);

module.exports = router;
