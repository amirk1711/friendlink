const nodeMailer = require("../config/nodemailer");

exports.passResetToken = function (myToken) {
	console.log("email from token: ", myToken.user.email);

	let mailOptions = {
		from: "friendlinkhelp@gmail.com", // sender address
		to: myToken.user.email, // list of receivers
		subject: "Friendlink | Reset Password",
		template: "reset_password", // the name of the template file i.e reset_password.handlebars
		context: {
			name: myToken.user.name,
			accessToken: myToken.accessToken,
			company: "Friendlink",
		},
	};

	nodeMailer.transporter.sendMail(mailOptions, function (err, info) {
		if (err) {
			console.log("Error in sending mail", err);
			return;
		}
		console.log("Email sent.", info);
		return;
	});
};
