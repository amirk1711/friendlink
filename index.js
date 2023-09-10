const express = require("express");
require("dotenv").config(); // to load environment variables from .env file into process.env
const helmet = require("helmet");
const cors = require("cors");
const app = express();
const db = require("./config/mongoose");
const env = require("./config/environment");
const passportJWT = require("./config/passport-jwt-strategy");
const port = env.port;

// enable cors
app.options("*", cors());
app.use(
	cors({
		allowedHeaders: ["sessionId", "Content-Type"],
		exposedHeaders: ["sessionId"],
		origin: "*",
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
		preflightContinue: false,
	})
);
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded into req.body
app.use(helmet()); // for securing http responses
app.use("/", require("./routes/index"));

// make server listen
app.listen(port, function (err) {
	if (err) {
		console.log(`Error in running server: ${err}`);
		return;
	}
	console.log(`Server is running on port: ${port}`);
});
