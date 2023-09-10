const express = require("express");
const passport = require("passport");
const chatApi = require("../controllers/chats");
const router = express.Router();
const jwt_auth_mw = passport.authenticate("jwt", { session: false });

router.post("/", jwt_auth_mw, chatApi.home);
router.get("/:chatUserId", jwt_auth_mw, chatApi.getChats);

module.exports = router;