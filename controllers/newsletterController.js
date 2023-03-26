//npm install @sendgrid/mail

// controllers/newsletterController.js
const sgMail = require('@sendgrid/mail');
const config = require('./../utils/config')

sgMail.setApiKey(config.sendGridApiKey);

async function sendNewsletter(req, res) {
  const { subject, htmlContent } = req.body;
  const subscribers = ['subscriber1@example.com', 'subscriber2@example.com']; // Replace with actual subscriber list

  const message = {
    to: subscribers,
    from: 'yourname@example.com',
    subject,
    html: htmlContent
  };

  try {
    await sgMail.send(message);
    res.status(200).send('Newsletter sent successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error sending newsletter');
  }
}

module.exports = {
  sendNewsletter
};
