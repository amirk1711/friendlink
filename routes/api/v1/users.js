const express = require("express");
const router = express.Router();
const usersApi = require("../../../controllers/api/v1/users_api");

const passport = require("passport");

router.post("/signup", usersApi.create);
router.post("/login", passport.checkAuthentication, usersApi.createSession);
router.get("/profile/:id", passport.checkAuthentication, usersApi.profile);
router.post("/update/:id", passport.checkAuthentication, usersApi.update);
router.delete("/:id", passport.checkAuthentication, usersApi.delete);
router.put("/follow/:id", passport.checkAuthentication, usersApi.follow);
router.put("/unfollow/:id", passport.checkAuthentication, usersApi.unfollow);

module.exports = router;
