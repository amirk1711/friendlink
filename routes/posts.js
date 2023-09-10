const express = require("express");
const passport = require("passport");
const postsApi = require("../controllers/posts");
const router = express.Router();
const jwt_auth_mw = passport.authenticate("jwt", { session: false });

router.post("/create", jwt_auth_mw, postsApi.create);
router.delete("/:id", jwt_auth_mw, postsApi.destroy);
router.get("/timeline/all", jwt_auth_mw, postsApi.timelinePosts);

module.exports = router;
