const express = require("express");
const router = express.Router();
const passport = require("passport");

const postsApi = require("../../../controllers/api/v1/posts_api");


router.post("/create", passport.authenticate("jwt", { session: false }), postsApi.create);
router.delete("/:id", passport.authenticate("jwt", { session: false }), postsApi.destroy);
router.get("/timeline/all", passport.authenticate("jwt", { session: false }), postsApi.timelinePosts);
//passport will put an authentication check on out delete request and
// by setting session: false  we tell passport to not generate session cookies

module.exports = router;
