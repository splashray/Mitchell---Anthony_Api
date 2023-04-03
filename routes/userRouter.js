// The `userRouter.js` file will contain our user router, which will handle user-related endpoints.

// routers/userRouter.js
const express = require('express');
const userController = require('../controllers/userController');
// const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();


router.get('/profile',  userController.getProfile);

router.patch('/password',  userController.updatePassword);

router.patch('/profile',  userController.updateProfile);



// router.get('/profile', authMiddleware.auth, userController.getProfile);

// router.patch('/password', authMiddleware.auth, userController.updatePassword);

// router.patch('/profile', authMiddleware.auth, userController.updateProfile);

module.exports = router;