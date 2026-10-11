const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');

const router = express.Router();

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `avatar-${req.user._id}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = /^image\/(jpeg|png|webp|gif)$/.test(file.mimetype);
    if (ok) cb(null, true);
    else cb(new Error('Only JPG, PNG, WEBP, or GIF allowed'));
  },
});

router.post('/avatar', protect, (req, res, next) => {
  upload.single('avatar')(req, res, async (err) => {
    if (err) {
      res.status(400);
      return next(err);
    }

    try {
      if (!req.file) {
        res.status(400);
        throw new Error('No file uploaded');
      }

      // Delete old avatar if it existed
      const existing = await User.findById(req.user._id);
      if (existing?.avatar) {
        const oldFile = path.join(uploadDir, path.basename(existing.avatar));
        if (fs.existsSync(oldFile)) {
          try { fs.unlinkSync(oldFile); } catch {}
        }
      }

      const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { avatar: url },
        { new: true }
      ).select('-password');

      res.json(user);
    } catch (e) {
      next(e);
    }
  });
});

module.exports = router;