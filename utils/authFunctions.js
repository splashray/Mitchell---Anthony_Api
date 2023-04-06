const { google } = require("googleapis");

const User = require("../models/userModel");
const config = require("./config");

const {
  handleAsync,
  createApiError,
  handleResponse
} = require("./helpers");

const baseUrl = config.BASE_URL;
const clientId = config.GOOGLE_CLIENTID;
const clientSecret = config.GOOGLE_CLIENT_SECRET;

const userExist = async _email => {
    const user = await User.findOne({ email: _email }).exec()
    if (user) {
      return user;
    }
    return false;
};
  

const SCOPES = [
    "email",
    "profile",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
    "openid"
];
  
const generateClient = _authType => {
    if (_authType === "login") {
        const redirectUrl = `${baseUrl}/login`;

        return new google.auth.OAuth2(clientId, clientSecret, redirectUrl, SCOPES);
    } else if (_authType === "signup") {
        const redirectUrl = `${baseUrl}/signup`;

        return new google.auth.OAuth2(clientId, clientSecret, redirectUrl, SCOPES);
    }
};

const getAccessToken = async (code, client) => {
    try {
      const { tokens } = await client.getToken(code);
      return tokens.id_token;
    } catch (error) {
      throw createApiError(
        "It seems you refreshed the page during the process, please restart the authentication process",
        400
      );
    }
};

// function to verify user google access token
const verify = async (_token, client) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: _token,
      audience: clientId
    });
    return ticket.getPayload();
  } catch (error) {
    throw createApiError("could not verify access token", 400);
  }
}

const googleSignup = async (_code, _client, payload) => {
  if (!payload) {
    tokenId = await getAccessToken(_code, _client); 
    payload = await verify(tokenId, _client);
  }
  const user = await userExist(payload.email)
  if (user) return user;
  
  const fullName = payload.name;
  const username = fullName.replace(/\s/g, "").toLowerCase() + Math.floor(Math.random() * 900) + 100;
  
    // create new user
    const newUser = new User({
      username: username,
      email: payload.email,
      authenticationType: {
        google: {
          uuid: payload.sub
        }
      }
    });

  const createdUser = await newUser.save();
  return createdUser;
}

module.exports = {
  verify, getAccessToken, generateClient, SCOPES, userExist, googleSignup
}