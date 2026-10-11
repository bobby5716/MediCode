const express = require('express');
const { checkReport } = require('../controllers/demoController');

const router = express.Router();

router.post('/report', checkReport);

module.exports = router;
