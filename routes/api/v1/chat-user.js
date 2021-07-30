const express = require("express");
const router = express.Router();
const passport = require("passport");

const chatUserApi = require("../../../controllers/api/v1/chat_users_api");

router.post("/", passport.authenticate("jwt", { session: false }), chatUserApi.home);
router.get("/:id", passport.authenticate("jwt", { session: false }), chatUserApi.getChatUsers);

module.exports = router;
