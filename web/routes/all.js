const express = require('express');
const router = express.Router();
const ctrl = require('../controller/all');


router.get('/', ctrl.index);

router.get('/search', ctrl.search);

router.get('/login', ctrl.login);

router.get('/signup', ctrl.signup);

router.get('/info_slide', ctrl.info_slide);

router.get('/festival/:fid/create', ctrl.createChatRoom);

router.get('/festival/:fid', ctrl.detail);

router.get('/chat', ctrl.chatList);

router.get('/chat/:lid', ctrl.chatRoom);

router.get('/room/:lid', ctrl.chatInfo);


module.exports = router;
