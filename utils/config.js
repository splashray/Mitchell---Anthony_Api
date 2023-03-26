// config.js
const dotenv = require ('dotenv')
dotenv.config()

const config = {
  mongoDbUrl: process.env.mongoDbUrl,

  PORT: process.env.PORT,

  googleClientId: process.env.googleClientId,

  googleClientSecret: process.env.googleClientSecret,

  jwtSecret: process.env.jwtSecret,

  jwtRefreshSecret: process.env.jwtRefreshSecret,

  aws_access_key_id:  process.env.aws_access_key_id,

  secretAccessKey: process.env.secretAccessKey
}

module.exports = config

