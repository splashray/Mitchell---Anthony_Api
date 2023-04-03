require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const config = require("../utils/config");
const UserToken = require("../models/userModel");
const { createApiError } = require("../utils/helpers.js");

const generateTokens = async (user) => {
    try {
        const payload = { userId: user._id }

        const accessToken = jwt.sign(
            payload,
            config.JWT_SECRET,
            { expiresIn: "24h" }
        );
        const refreshToken = jwt.sign(
            payload,
            config.REFRESH_TOKEN,
            { expiresIn: "30d" }
        );

        const tokenUser = await User.findOne({ refreshToken: user.refreshToken });
        tokenUser.refreshToken = refreshToken;
        tokenUser.save();
        return Promise.resolve({ accessToken, refreshToken });
        
    } catch (err) {
        return Promise.reject(err);
    }
};

const verifyAccessToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res
        .status(401)
        .json({ message: "authentication invalid", success: false });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        msg: "Token not authorized"
      });
    }

    const payload = jwt.verify(token, config.JWT_SECRET);

    const { userId } = payload;

    const user = await User.findById(userId);
    // Check if user account exists
    if (!user) {
      return res.status(401).json({
        success: false,
        msg: "Token not authorized"
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error(error);

    res.status(401).json({
      success: false,
      msg: "Session Expired"
    });
  }
};

const verifyUserRole = (role) => {
  return async (req, res, next) => {
    try {
      await verifyAccessToken(req, res, () => {});

      if (req.user.roles !== role) {
        return res.status(401).send(`Unauthorized as ${role}`);
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).send('Unauthorized');
    }
  };
};

// Auth for User
const verifyAuthUser = verifyUserRole('user');

// Auth for Admin
const verifyAuthAdmin = verifyUserRole('admin');

const verifyRefreshToken = refreshToken => {
  const privateKey = config.REFRESH_TOKEN;

  return new Promise((resolve, reject) => {
    UserToken.findOne({ refreshToken: refreshToken }, (err, doc) => {
      if (!doc) return reject(createApiError("Invalid refresh token", 400));

      jwt.verify(refreshToken, privateKey, (err, tokenDetails) => {
        if (err) return reject(createApiError("Invalid refresh token", 400));

        resolve({
          tokenDetails,
          error: false,
          message: "Valid refresh token"
        });
      });
    });
  });
};

module.exports = { 
    generateTokens,
    verifyAuthUser,
    verifyAuthAdmin,
    verifyRefreshToken 
};
