const User = require("../../../models/user");
const ResetPassToken = require("../../../models/reset_pass_token");
const crypto = require("crypto");
// inbuilt crypto
// const crypto = require('node:crypto');

const resetPasswordMailer = require("../../../mailers/reset_password_mailer");

module.exports.confirmEmail = async function (req, res) {
	try {
		// get the email of user
		const email = req.body.email;

		let user = await User.findOne({ email: email });
		if (user) {
			// generate access token for email using crypto
			const accessToken = crypto.randomBytes(20).toString("hex");

			// token will be valid for only 20 minutes
			const token = await ResetPassToken.create({
				user: user._id,
				accessToken: accessToken,
				validTime: Date.now() + 1200000,
			});

			const myToken = await token.populate("user", "name email").execPopulate();

			// if the user already exists, then send the mail
			resetPasswordMailer.passResetToken(myToken);

			return res.status(200).json({
				message: "Password reset link has been sent to the user!",
				success: true,
			});
		} else {
			console.log("User not found");
			return res.status(404).json({
				message: "User not found!",
				success: false,
			});
		}
	} catch (err) {
		return res.status(500).json({
			message: "Internal server error",
			success: false,
		});
	}
};

module.exports.reset = async function (req, res) {
	try {
		let token = req.query.accessToken;
		let accessToken = await ResetPassToken.findOne({ accessToken: token });

		if (accessToken && accessToken.validTime >= Date.now()) {
			return res.status(200).json({
				message: "Render reset password page",
				success: true,
			});
		} else {
			return res.status(422).json({
				message: "Password reset link is expired.",
				success: false,
			});
		}
	} catch (err) {
		return res.status(500).json({
			message: "Internal server error",
			error: err,
		});
	}
};

module.exports.resetPassword = async function (req, res) {
	try {
		let token = req.body.accessToken;
		let accessToken = await ResetPassToken.findOne({ accessToken: token });

		if (accessToken && accessToken.validTime >= Date.now()) {
			let user = await User.findById(accessToken.user);
			if (user.password == req.body.password) {
				return res.status(422).json({
					message: "Please do not use a password that is already used!",
					success: false,
				});
			}

			user.password = req.body.password;
			await user.save();

			accessToken.validTime = 0;
			accessToken.remove();

			return res.status(200).json({
				message: "Password Reset Successfull!",
				success: true,
			});
		} else {
			return res.status(401).json({
				message: "You are not authorized to reset the password!",
				success: false,
			});
		}
	} catch (err) {
		return res.status(500).json({
			message: "Internal server error",
			success: false,
			error: err,
		});
	}
};
