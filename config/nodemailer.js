const nodemailer = require("nodemailer");
const hbs = require("nodemailer-handlebars");
const path = require("path");
const env = require("./environment");

let transporter = nodemailer.createTransport(env.smtp);

// point to the template folder
const handlebarOptions = {
	viewEngine: "express-handlebars",
	viewPath: path.join(__dirname + "../views/"),
};

// use a template file with nodemailer
transporter.use("compile", hbs(handlebarOptions));

module.exports = {
	transporter: transporter,
};
