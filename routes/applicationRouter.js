// routers/applicationRouter.js
const express = require('express');
const applicationController = require('../controllers/applicationController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, applicationController.createApplication);

router.get('/', authMiddleware, applicationController.getApplicationStatus);

router.patch('/:userId', authMiddleware, applicationController.updateApplicationStatus);

module.exports = router;
