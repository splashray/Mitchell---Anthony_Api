// config.js
const dotenv = require ('dotenv')
dotenv.config()

const config = {
  mongoDbUrl: process.env.mongoDbUrl,

  PORT: process.env.PORT,

  JWT_SECRET: process.env.jwtSecret,

  REFRESH_TOKEN: process.env.jwtRefreshSecret,

  BASE_URL: process.env.base_url,

  GOOGLE_CLIENTID: process.env.googleClientId,

  GOOGLE_CLIENT_SECRET: process.env.googleClientSecret,

  // aws_access_key_id:  process.env.aws_access_key_id,

  // secretAccessKey: process.env.secretAccessKey
  
  // sendGridApiKey: process.env.sendGridApiKey
  
}

module.exports = config

