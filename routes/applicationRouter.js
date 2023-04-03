// routers/applicationRouter.js
const express = require('express');

const applicationController = require('../controllers/applicationController');
const { verifyAuthUser, verifyAuthAdmin} = require('../middleware/authentication');

const router = express.Router();

router.post('/', verifyAuthUser,  applicationController.createApplication);

router.get('/', applicationController.getUserApplication);

router.get('/admin', verifyAuthAdmin, applicationController.getAllApplication);

router.patch('/:userId', verifyAuthUser,  applicationController.updateApplication);

router.patch('/admin/:userId', verifyAuthAdmin,applicationController.updateApplicationStatus);

router.delete('/admin/:appId', verifyAuthAdmin,applicationController.deleteApplication);

module.exports = router;
