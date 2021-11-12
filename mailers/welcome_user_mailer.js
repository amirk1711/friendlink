const nodeMailer = require("../config/nodemailer");

exports.welcomeUser = function (user) {
	let htmlString = nodeMailer.renderTemplate({ user: user }, "/welcome_user.ejs");

	let mailOptions = {
		from: "friendlinkhelp@gmail.com",
		to: user.email,
		subject: "Welcome to Friendlink",
		html: htmlString,
	};

	nodeMailer.transporter.sendMail(mailOptions, function (err, info) {
		if (err) {
			console.log("Error in sending mail", err);
			return;
		}
		console.log("Email sent!");
		return;
	});
};
