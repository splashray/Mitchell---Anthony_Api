const Joi = require('joi');

function validateRegister(req, res, next) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().min(3).max(20).required(),
    password: Joi.string().min(8).max(20).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  next();
}

function validateLogin(req, res, next) {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().min(8).max(20).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  next();
}

module.exports = {
  validateRegister,
  validateLogin
};











// const Joi = require('joi');

// const registrationSchema = Joi.object({
//   email: Joi.string().email().required(),
//   username: Joi.string().min(3).max(30).required(),
//   password: Joi.string().min(8).max(50).required(),
// });


// function validateRegistration(req, res, next) {
//   const { error } = registrationSchema.validate(req.body);
//   if (error) {
//     return res.status(400).json({ error: error.details[0].message });
//   }
//   next();
// }



// router.post('/register', validateRegistration, async (req, res) => {
//   // ... registration logic ...
// });




// const Joi = require('joi');

// const applicationSchema = Joi.object({
//   fullName: Joi.string().required(),
//   address: Joi.string().required(),
//   phoneNumber: Joi.string().required(),
//   schoolOfChoice: Joi.string().required(),
//   certificatePdf: Joi.any().meta({ swaggerType: 'file' }).required(),
// });


// function validateApplication(req, res, next) {
//   const { error } = applicationSchema.validate(req.body);
//   if (error) {
//     return res.status(400).json({ error: error.details[0].message });
//   }
//   next();
// }


// router.post('/application', validateApplication, upload.single('certificatePdf'), async (req, res) => {
//   // ... application form logic ...
// });




// const Joi = require('joi');

// const newsletterSchema = Joi.object({
//   email: Joi.string().email().required(),
// });


// function validateNewsletter(req, res, next) {
//   const { error } = newsletterSchema.validate(req.body);
//   if (error) {
//     return res.status(400).json({ error: error.details[0].message });
//   }
//   next();
// }


// router.post('/newsletter', validateNewsletter, async (req, res) => {
//   // ... newsletter subscription logic ...
// });



// const Joi = require('joi');

// const chatbotSchema = Joi.object({
//   question: Joi.string().required(),
//   answer: Joi.string().required(),
// });


// function validateChatbot(req, res, next) {
//   const { error } = chatbotSchema.validate(req.body);
//   if (error) {
//     return res.status(400).json({ error: error.details[0].message });
//   }
//   next();
// }


// router.post('/chatbot/questions', validateChatbot, async (req, res) => {
//   // ... add question and answer logic ...
// });

// router.put('/chatbot/questions/:id', validateChatbot, async (req, res) => {
//   // ... update question and answer logic ...
// });

// router.delete('/chatbot/questions/:id', async (req, res) => {
//   // ... delete question and answer logic ...
// });



