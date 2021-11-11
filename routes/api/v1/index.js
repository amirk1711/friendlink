const express = require('express');

const router = express.Router();

router.use('/posts', require('./posts'));
router.use('/users', require('./users'));
router.use('/comments', require('./comments'));
router.use('/likes', require('./likes'));
router.use('/chat-users', require('./chat-user'));
router.use('/chats', require('./chat'));
router.use('/accounts', require('./accounts'));

module.exports = router;