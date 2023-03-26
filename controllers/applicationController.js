// controllers/applicationController.js

const Application = require('../models/applicationModel');
const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');
const config = require('./../utils/config')

const s3 = new AWS.S3({
  accessKeyId: config.aws_access_key_id,
  secretAccessKey: config.secretAccessKey
});



async function createApplication(req, res) {
  const { fullName, address, phoneNumber, schoolOfChoice } = req.body;
  const { userId } = req;

  try {
    // Upload the certificate PDF to AWS S3
    const certificatePdf = req.file;
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${uuidv4()}.${certificatePdf.originalname.split('.').pop()}`,
      Body: certificatePdf.buffer
    };
    const result = await s3.upload(params).promise();
    const certificateUrl = result.Location;

    // Create the application in the database
    const application = new Application({
      fullName,
      address,
      phoneNumber,
      schoolOfChoice,
      certificateUrl,
      status: 'pending',
      user: userId
    });
    await application.save();

    res.status(201).json({
      status: 'success',
      data: {
        application
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong'
    });
  }
};




async function getApplicationStatus(req, res) {
  const userId = req.user._id;

  try {
    const application = await Application.findOne({ userId }).populate('userId', 'email');

    if (!application) {
      res.status(404).json({ error: 'Application not found' });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: {
        fullName: application.fullName,
        address: application.address,
        phoneNumber: application.phoneNumber,
        schoolOfChoice: application.schoolOfChoice,
        certificateUrl: application.certificateUrl,
        status: application.status,
        userEmail: application.userId.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get application status' });
  }
}



async function updateApplicationStatus(req, res) {
  const { status } = req.body;
  const userId = req.params.userId;

  try {
    const application = await Application.findOne({ userId });

    if (!application) {
      res.status(404).json({ error: 'Application not found' });
      return;
    }

    application.status = status;
    await application.save();

    res.status(200).json({ message: 'Application status updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update application status' });
  }
}

module.exports = {
  createApplication,
  getApplicationStatus,
  updateApplicationStatus
};
