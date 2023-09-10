const express = require("express");
const router = express.Router();

router.use("/users", require("./users"));
router.use("/posts", require("./posts"));
router.use("/comments", require("./comments"));
router.use("/likes", require("./likes"));
router.use('/chat-users', require('./chat-user'));
router.use('/chats', require('./chat'));

module.exports = router;
