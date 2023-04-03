// // controllers/chatbotController.js
// const dialogflow = require('@google-cloud/dialogflow');
// const uuid = require('uuid');

// const projectId = process.env.DIALOGFLOW_PROJECT_ID;
// const sessionId = uuid.v4();
// const languageCode = 'en-US';

// const sessionClient = new dialogflow.SessionsClient();

// exports.sendMessage = async (req, res) => {
//   const { message } = req.body;

//   try {
//     const sessionPath = sessionClient.projectAgentSessionPath(
//       projectId,
//       sessionId
//     );

//     const request = {
//       session: sessionPath,
//       queryInput: {
//         text: {
//           text: message,
//           languageCode
//         }
//       }
//     };

//     const responses = await sessionClient.detectIntent(request);
//     const result = responses[0].queryResult;

//     res.json({
//       message: result.fulfillmentText
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       status: 'error',
//       message: 'Something went wrong'
//     });
//   }
// };


// // controllers/chatbotController.js
// const { IntentsClient } = require('@google-cloud/dialogflow');
// const uuid = require('uuid');

// const projectId = process.env.DIALOGFLOW_PROJECT_ID;

// const intentsClient = new IntentsClient();

// exports.createIntent = async (req, res) => {
//   const { displayName, trainingPhrases, responses } = req.body;

//   try {
//     const intent = {
//       displayName,
//       trainingPhrases: trainingPhrases.map((phrase) => ({
//         type: 'EXAMPLE',
//         parts: [
//           {
//             text: phrase
//           }
//         ]
//       })),
//       messages: responses.map((response) => ({
//         text: {
//           text: [response]
//         }
//       }))
//     };

//     const request = {
//       parent: `projects/${projectId}/agent`,
//       intent
//     };

//     const [createdIntent] = await intentsClient.createIntent(request);

//     res.json({
//       status: 'success',
//       message: `Intent '${createdIntent.displayName}' created successfully`
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       status: 'error',
//       message: 'Something went wrong'
//     });
//   }
// };



