const express = require('express');
const router = express.Router();
const ctrl = require('../controller/all');


router.get('/', ctrl.index);

router.get('/search', ctrl.search);

router.get('/login', ctrl.login);

router.get('/signup', ctrl.signup);

router.get('/info_slide', ctrl.info_slide);

router.get('/:fid', ctrl.detail);



module.exports = router;
