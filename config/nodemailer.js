const nodemailer = require("nodemailer");
const env = require("./environment");
const ejs = require('ejs');
const path = require('path');

let transporter = nodemailer.createTransport(env.smtp);

// relativePath = from where being the mail is sent
let renderTemplate = (data, relativePath) => {
	let mailHTML;
	ejs.renderFile(
		path.join(__dirname, "../views", relativePath),
		data,
		function (err, template) {
			if (err) {
				console.log("Error in rendering template", err);
				return;
			}

			mailHTML = template;
		}
	);

	return mailHTML;
};

module.exports = {
	transporter: transporter,
	renderTemplate: renderTemplate,
};
