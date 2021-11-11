const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");
const env = require("./environment");

let transporter = nodemailer.createTransport(env.smtp);

// point to the template folder
const handlebarOptions = {
	viewEngine: {
		extName: ".hbs",
		partialsDir: path.resolve("../views/"),
		defaultLayout: false,
	},
	viewPath: path.resolve("../views/"),
};

// use a template file with nodemailer
transporter.use("compile", hbs(handlebarOptions));

module.exports = {
	transporter: transporter,
};
