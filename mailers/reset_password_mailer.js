const nodeMailer = require("../config/nodemailer");

exports.passResetToken = function (myToken) {
	console.log("email from token: ", myToken.user.email);

    let htmlString = nodeMailer.renderTemplate({token: myToken}, '/reset_password.ejs');


	let mailOptions = {
		from: "friendlinkhelp@gmail.com",
		to: myToken.user.email, 
		subject: "Friendlink | Reset Password",
		html: htmlString,
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
