const express = require("express");
const router = express.Router();
const usersApi = require("../../../controllers/api/v1/users_api");

const passport = require("passport");

router.post("/create", usersApi.create);
router.post(
	"/create-session",
	passport.authenticate("local", { failureRedirect: "/users/sign-in" }),
	usersApi.createSession
);
router.get("/profile/:id", passport.checkAuthentication, usersApi.profile);
router.post("/update/:id", passport.checkAuthentication, usersApi.update);
router.delete("/:id", passport.checkAuthentication, usersApi.delete);
router.put("/follow/:id", passport.checkAuthentication, usersApi.follow);
router.put("/unfollow/:id", passport.checkAuthentication, usersApi.unfollow);

module.exports = router;
