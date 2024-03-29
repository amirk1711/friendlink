const express = require("express");
const passport = require("passport");
const commentsApi = require("../controllers/comments");
const router = express.Router();
const jwt_auth_mw = passport.authenticate("jwt", { session: false });

router.post("/create", jwt_auth_mw, commentsApi.create);
router.delete("/:id", jwt_auth_mw, commentsApi.destroy);

module.exports = router;
