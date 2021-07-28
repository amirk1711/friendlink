const express = require('express');
const router = express.Router();
const passport = require('passport');

const chatApi = require('../../../controllers/api/v1/chats_api');

router.post('/', passport.authenticate("jwt", { session: false }), chatApi.home);
router.get('/:chatUserId', passport.authenticate("jwt", { session: false }), chatApi.getChats);

module.exports = router;