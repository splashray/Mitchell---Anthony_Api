// routers/newsletterRouter.js
const express = require('express');
const newsletterController = require('../controllers/newsletterController');
// const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// router.post('/send', newsletterController.sendNewsletter);
// router.post('/send', authMiddleware.adminAuth, newsletterController.sendNewsletter);

module.exports = router;
