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

module.exports = router;
