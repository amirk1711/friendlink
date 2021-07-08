const User = require("../../../models/user");
const jwt = require("jsonwebtoken");
const env = require("../../../config/environment");

module.exports.create = async function (req, res) {
	console.log("req.body from users_api", req.body);
	//check if the password and confirm_password matches or not
	if (req.body.password != req.body.confirm_password) {
		console.log("Passwords do not match!");
		return res.status(422).json({
			message: "Passwords do not match!",
		});
	}

	// find user by email
	User.findOne({ email: req.body.email }, function (err, user) {
		if (err) {
			console.log("Error in finding user!");
			return res.status(422).json({
				message: "Error in finding user!",
			});
		}

		// if user is not found, create a new user
		if (!user) {
			User.create(req.body, function (err, user) {
				if (err) {
					req.flash("error in creating user ", err);
					return res.status(422).json({
						message: "error in creating user",
					});
				}

				req.flash("success", "You have signed up, sign in to continue!");
				return res.status(200).json({
					success: true,
					message: "You have signed up, sign in to continue!",
				});
			});
		} else {
			req.flash("success", "You have already signed up, login to continue!");
			return res.status(200).json({
				message: "You have already signed up, sign in to continue!",
			});
		}
	});
};

module.exports.createSession = async function (req, res) {
	try {
		let user = await User.findOne({ email: req.body.email });

		if (!user || user.password != req.body.password) {
			return res.status(422).json({
				message: "Invalid username or password!",
			});
		}

		// find that user and generate jwt corresponding to that user
		return res.status(200).json({
			message: "Sign in successfull, here is your token please keep it safe!",
			data: {
				token: jwt.sign(user.toJSON(), env.jwt_secret, { expiresIn: "1000000" }),
			},
			success: true,
		});
	} catch (err) {
		console.log("Error in creating sesssion******", err);
		return res.status(500).json({
			message: "Internal server error",
		});
	}
};

module.exports.profile = async function (req, res) {
	try {
		let user = await User.findById(req.params.id);

		return res.status(200).json({
			message: "User profile fetched successfully!",
			data: {
				title: `${user.name} | Profile`,
				profile_user: user,
			},
			success: true,
		});
	} catch (err) {
		console.log("Error in fetching user profile******", err);
		return res.status(500).json({
			message: "Internal server error",
		});
	}
};

module.exports.update = async function (req, res) {
	if (req.user.id == req.params.id) {
		try {
			let user = await User.findById(req.user.id);

			user.name = req.body.name;
			if(req.body.avatar !== ''){
				user.avatar = req.body.avatar;
			}

			user.save();

			return res.status(200).json({
				message: 'Profile updated successfully!',
				data: {
					updated_profile: user,
				},
				success: true,
			});
		} catch (error) {
			req.flash("error", error);
			return res.status(500).json({
				message: 'Error in updating profile!'
			});
		}
	} else {
		req.flash("error", "Unauthorized !");
		return res.status(401).json({
			message: 'Unauthorized!'
		});
	}
};
