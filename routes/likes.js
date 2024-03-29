const express = require("express");
const passport = require("passport");
const likesApi = require("../controllers/likes");
const router = express.Router();
const jwt_auth_mw = passport.authenticate("jwt", { session: false });

router.post("/toggle", jwt_auth_mw, likesApi.toggleLike); 
router.get("/fetch", jwt_auth_mw, likesApi.fetchLikes);

module.exports = router;