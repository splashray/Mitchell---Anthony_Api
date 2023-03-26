// The `authMiddleware.js` file will contain our middleware functions for authenticating and authorizing requests.

// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const config = require('./../utils/config')


function signAccessToken(userId) {
    return new Promise((resolve, reject) => {
        const payload = {};
        const secret = config.jwtSecret;
        const options = {
            expiresIn: '1h',
            issuer: 'example.com',
            audience: userId.toString()
        };

        jwt.sign(payload, secret, options, (err, token) => {
        if (err) {
            console.error(err);
            reject(err);
            return;
        }
             resolve(token);
        });
    });
}

function signRefreshToken(userId) {
    return new Promise((resolve, reject) => {
        const payload = {};
        const secret = config.jwtRefreshSecret;
        const options = {
            expiresIn: '1y',
            issuer: 'example.com',
            audience: userId.toString()
        };

        jwt.sign(payload, secret, options, (err, token) => {
        if (err) {
            console.error(err);
            reject(err);
            return;
        }
            resolve(token);
        });
    });
}

async function verifyAccessToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) return res.status(401).send('Access token not found');
        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = decoded;
        next();
    } catch (error) {
        console.error(error);
        res.status(403).send('Invalid token');
    }
}

async function verifyRefreshToken(refreshToken) {
    return new Promise((resolve, reject) => {
        jwt.verify(refreshToken, config.jwtRefreshSecret, (err, decoded) => {
            if (err) {
            console.error(err);
            reject(err);
            return;
            }
            resolve(decoded);
        });
    });
}

async function authUser(req, res, next) {
    try {
        const decoded = await verifyAccessToken(req, res, next);
        if (decoded.roles !== 'user') {
        res.status(401).send('Unauthorized');
        return;
        }
        next();
    } catch (error) {
        console.error(error);
        res.status(401).send('Unauthorized');
    }
}

async function authAdmin(req, res, next) {
    try {
        const decoded = await verifyAccessToken(req, res, next);
        if (decoded.roles !== 'admin') {
        res.status(401).send('Unauthorized');
        return;
        }
        next();
    } catch (error) {
        console.error(error);
        res.status(401).send('Unauthorized');
    }
}

module.exports = {
    signAccessToken,
    signRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    authUser,
    authAdmin
};