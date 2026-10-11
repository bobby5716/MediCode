const express = require('express');
const {
  createRecord,
  listRecords,
  getRecord,
  updateRecord,
  deleteRecord,
  translateSummary,
} = require('../controllers/recordsController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createRecord);
router.get('/', protect, listRecords);
router.get('/:id', protect, getRecord);
router.patch('/:id', protect, updateRecord);
router.delete('/:id', protect, deleteRecord);
router.get('/:id/translate', protect, translateSummary);

module.exports = router;