const express = require("express");
require("dotenv").config();
const env = require("./config/environment");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const app = express();
const port = process.env.PORT || 8000;
const db = require("./config/mongoose");

const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const passportJWT = require("./config/passport-jwt-strategy");
const passportGoogle = require("./config/passport-google-oauth2-strategy");
const { pass } = require("./config/mongoose");
const MongoStore = require("connect-mongo");
// const flash = require("connect-flash");
// const customMware = require("./config/middleware");

const path = require("path");
const { Server } = require("http");

const cors = require("cors");

//enables cors
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

// to use dotenv
// dotenv.config();

const uri = process.env.MONGODB_URI;


// express.urlencoded will extract the data from the form and add them into req.body
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// app.use(express.json());
// use helmet
app.use(helmet());

// add a middleware which encrypt the session cookie
app.use(
	session({
		name: "friendlink",
		// change the secret before deployment in producction mode
		secret: env.session_cookie_key,
		saveUninitialized: false,
		resave: false,
		cookie: {
			maxAge: 1000 * 60 * 1000,
		},
		// mongo store is used to store session cookie in the db
		store: MongoStore.create(
			{
				// mongooseConnection: db,
				mongoUrl: uri || "mongodb://localhost/friendlink-development",
				autoRemove: "disabled",
			},
			function (err) {
				if (err) {
					console.log(`Error in mongo store: ${err}`);
				} else {
					console.log("connect-mongo setup ok");
				}
			}
		),
	})
);

// we need to tell the app to use passport
app.use(passport.initialize());
app.use(passport.session());


// handle the routes
// writing index is not neccessary
app.use("/", require("./routes/index"));

// make server listen
app.listen(port, function (err) {
	if (err) {
		console.log(`Error in running server: ${err}`);
		return;
	}
	console.log(`Server is running on port: ${port}`);
});
