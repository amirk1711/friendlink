const express = require("express");
const passport = require("passport");
const usersApi = require("../controllers/users");
const router = express.Router();
const jwt_auth_mw = passport.authenticate("jwt", { session: false });

router.post("/signup", usersApi.signup);
router.post("/login", usersApi.login);
router.get("/profile/:id", jwt_auth_mw, usersApi.profile);
router.post("/update/:id", jwt_auth_mw, usersApi.update);
router.put("/change/profile", jwt_auth_mw, usersApi.changeProfile);
router.delete("/:id", jwt_auth_mw, usersApi.delete);
router.post("/change/password", jwt_auth_mw, usersApi.changePassword);
router.put("/follow/:id", jwt_auth_mw, usersApi.follow);
router.put("/unfollow/:id", jwt_auth_mw, usersApi.unfollow);
router.get("/suggestions/:id", jwt_auth_mw, usersApi.fetchSuggestions);
router.post("/check/username", usersApi.checkUsername);

module.exports = router;
