
const express = require('express');

const {
  register,
  login,
  getMe,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;
