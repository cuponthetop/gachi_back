const express = require('express');
const router = express.Router();
const ctrl = require('../controller/all');

router.get('/', ctrl.index);

router.get('/search', ctrl.search);

module.exports = router;
