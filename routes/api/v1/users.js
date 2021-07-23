const express = require("express");
const router = express.Router();
const usersApi = require("../../../controllers/api/v1/users_api");

const passport = require("passport");

router.post("/signup", usersApi.create);
router.post("/login", usersApi.createSession);
router.get("/profile/:id", passport.authenticate("jwt", { session: false }), usersApi.profile);
router.post("/update/:id", passport.authenticate("jwt", { session: false }), usersApi.update);
router.delete("/:id", passport.authenticate("jwt", { session: false }), usersApi.delete);
router.put("/follow/:id", passport.authenticate("jwt", { session: false }), usersApi.follow);
router.put("/unfollow/:id", passport.authenticate("jwt", { session: false }), usersApi.unfollow);
router.get("/suggestions/:id", passport.authenticate("jwt", { session: false }), usersApi.fetchSuggestions);
router.put("/change/profile", passport.authenticate("jwt", { session: false }), usersApi.changeProfile);
router.put("/remove/profile", passport.authenticate("jwt", { session: false }), usersApi.changeProfile);
router.post("/change/password", passport.authenticate("jwt", { session: false }), usersApi.changePassword);


module.exports = router;
