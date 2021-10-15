const express = require("express");
const router = express.Router();

// import home controller
// const homeController = require("../controllers/home_controller");

// router.get("/", homeController.home);

// router.use("/users", require("./users"));
// router.use("/posts", require("./posts"));
// router.use("/comments", require("./comments"));
router.use("/api", require("./api"));
// router.use("/accounts", require("./accounts"));
// router.use("/likes", require("./likes"));

module.exports = router;
