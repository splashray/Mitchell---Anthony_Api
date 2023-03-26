// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { google } = require('googleapis');

const config = require('./../utils/config')
const User = require('../models/userModel');

const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../middleware/authMiddleware');


async function register(req, res) {
  try {
    const { email, username, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).send('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, username, password: hashedPassword });
    await user.save();

    const accessToken = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);
    res.status(201).json({ accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
}


async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid credentials');
    }
    const accessToken = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);
    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
}


async function googleAuth(req, res) {
  try {
    const { code } = req.body;
    const { tokens } = await google.auth.getToken({
      code,
      client_id: config.googleClientId,
      client_secret: config.googleClientSecret,
      redirect_uri: 'http://localhost:3000/auth/google/callback'
    });
    const googleUser = google.oauth2({ version: 'v2', auth: google.auth({ tokens }) });
    const { data } = await googleUser.userinfo.get();
    const existingUser = await User.findOne({ email: data.email });

    //old user
    if (existingUser) {
      const accessToken = signAccessToken(existingUser._id);
      const refreshToken = signRefreshToken(existingUser._id);
      return res.json({ accessToken, refreshToken });
    }

    //new user
    const username = data.email.split('@')[0];
    const password = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email: data.email, username, password: hashedPassword });
    await user.save();
    const accessToken = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);
    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
}


async function logout(req, res) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).send('Refresh token not provided');
    }
    const userId = await verifyRefreshToken(refreshToken);
    // TODO: add code to invalidate the refresh token in the database
    res.send('Logged out successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
}

// async function logout(req, res) {
//     try {
//       const refreshToken = req.cookies.refreshToken;
//       await User.updateOne({ refreshToken }, { $unset: { refreshToken: 1 } });
//       res.clearCookie('accessToken');
//       res.clearCookie('refreshToken');
//       res.sendStatus(204);
//     } catch (error) {
//       console.error(error);
//       res.status(500).send('Internal server error');
//     }
//   }
  

module.exports = {
    register,
    login,
    googleAuth,
    logout
};