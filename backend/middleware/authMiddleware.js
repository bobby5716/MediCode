const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
    } catch {
      res.status(401);
      return next(new Error('Not authorized, token failed'));
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      res.status(401);
      return next(new Error('Not authorized, token failed'));
    }

    try {
      req.user = await User.findById(decoded.id).select(
        '-password -emailVerificationOtpHash -emailVerificationOtpExpires -passwordResetOtpHash -passwordResetOtpExpires'
      );
      if (!req.user || req.user.emailVerified !== true) {
        res.status(401);
        return next(new Error('Not authorized, account unavailable'));
      }
      return next();
    } catch (error) {
      return next(error);
    }
  }
  res.status(401);
  next(new Error('Not authorized, no token'));
};

module.exports = { protect };
