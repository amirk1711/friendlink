const express = require("express");
const passport = require("passport");
const chatUserApi = require("../controllers/chat_users");
const router = express.Router();
const jwt_auth_mw = passport.authenticate("jwt", { session: false });

router.post("/", jwt_auth_mw, chatUserApi.home);
router.get("/:id", jwt_auth_mw, chatUserApi.getChatUsers);

module.exports = router;
