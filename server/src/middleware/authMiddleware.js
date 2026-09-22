const jwt = require('jsonwebtoken');
const { localDb, isUsingMongo } = require('../config/db');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.replace('Bearer ', '').trim();
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'testpilot_default_secret');

    let user;
    if (isUsingMongo()) {
      user = await User.findById(decoded.id).select('-password');
    } else {
      user = localDb.findUserById(decoded.id);
      if (user) {
        // eslint-disable-next-line no-unused-vars
        const { password, ...safeUser } = user;
        user = safeUser;
      }
    }

    if (!user) {
      // If user was created in guest mode or token has userId
      if (decoded.isGuest) {
        req.user = {
          id: decoded.id,
          name: decoded.name || 'Guest Developer',
          email: decoded.email || 'guest@testpilot.local',
          isGuest: true
        };
        return next();
      }
      return res.status(401).json({ error: 'User not found or token invalid.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

module.exports = authMiddleware;
