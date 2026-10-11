const express = require('express');
const {
  runAiTask,
  streamAiTask,
  listTasks,
  getTask,
  getStats,
  deleteTask,
  updateNotes,
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Static routes FIRST
router.get('/tasks/all', protect, listTasks);
router.get('/tasks/:id', protect, getTask);
router.patch('/tasks/:id/notes', protect, updateNotes);
router.delete('/tasks/:id', protect, deleteTask);
router.get('/stats/summary', protect, getStats);

// Streaming route BEFORE the generic :type POST
router.post('/:type/stream', protect, streamAiTask);

// Generic POST LAST
router.post('/:type', protect, runAiTask);

module.exports = router;