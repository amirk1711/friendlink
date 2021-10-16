const User = require("../../../models/user");
const Post = require("../../../models/post");
const Comment = require("../../../models/comment");
const Like = require("../../../models/like");
const ResetPassToken = require("../../../models/reset_pass_token");

const genUsername = require("unique-username-generator");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const env = require("../../../config/environment");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(env.google_client_id);

module.exports.googleAuth = async function (req, res) {
	try {
		const { token } = req.body;
		const ticket = await client.verifyIdToken({
			idToken: token,
			audience: env.google_client_id,
		});

		const { name, email } = ticket.getPayload();

		// create a new user or find if the user already exist
		User.findOne({ email: email }).exec(async function (err, user) {
			if (err) {
				console.log("Error in finding email", err);
				return;
			}

			if (user) {
				// if user found
				user = await user
					.populate("followers", "-password")
					.populate("following", "-password")
					.populate("suggestions", "-password")
					.execPopulate();

				// find that user and generate jwt corresponding to that user
				return res.status(200).json({
					message: "Sign in successfull, here is your token please keep it safe!",
					data: {
						token: jwt.sign(user.toJSON(), env.jwt_secret, { expiresIn: "1000000" }),
						user: user,
					},
					success: true,
				});
			} else {
				// create user and sign in
				User.create(
					{
						name: name,
						email: email,
						password: crypto.randomBytes(20).toString("hex"),
						username: genUsername.generateFromEmail(email, 3),
					},
					function (err, user) {
						if (err) {
							return res.status(422).json({
								message: "error in creating user",
							});
						}

						return res.status(200).json({
							success: true,
							message: "You have signed up, sign in to continue!",
							data: {
								token: jwt.sign(user.toJSON(), env.jwt_secret, {
									expiresIn: "1000000",
								}),
								user: user,
							},
						});
					}
				);
			}
		});
	} catch (err) {
		console.log("Error in creating sesssion******", err);
		return res.status(500).json({
			message: "Internal server error",
		});
	}
};

module.exports.create = async function (req, res) {
	console.log("req.body from users_api", req.body);

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
					return res.status(422).json({
						message: "error in creating user",
					});
				}

				return res.status(200).json({
					success: true,
					message: "You have signed up, sign in to continue!",
					data: {
						token: jwt.sign(user.toJSON(), env.jwt_secret, { expiresIn: "1000000" }),
						user: user,
					},
				});
			});
		} else {
			return res.status(200).json({
				message: "You have already signed up, sign in to continue!",
				data: {
					user: user,
				},
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

		user = await user
			.populate("followers", "-password")
			.populate("following", "-password")
			.populate("suggestions", "-password")
			.execPopulate();

		// find that user and generate jwt corresponding to that user
		return res.status(200).json({
			message: "Sign in successfull, here is your token please keep it safe!",
			data: {
				token: jwt.sign(user.toJSON(), env.jwt_secret, { expiresIn: "1000000" }),
				user: user,
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
		let userPost = await Post.find({ user: req.params.id });
		

		user = await user
			.populate("followers", "-password")
			.populate("following", "-password")
			.populate("suggestions", "-password")
			.execPopulate();

		//  .populate("user")
		// 	.populate({
		// 		path: "comments",
		// 		populate: {
		// 			path: "user likes",
		// 		},
		// 	})
		// 	.populate("likes")
		return res.status(200).json({
			message: "User profile fetched successfully!",
			data: {
				profile_user: user,
				profile_posts: userPost,
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
	try {
		let user = await User.findById(req.user._id);

		console.log("User in update profile api", user);

		user.name = req.body.name;
		user.username = req.body.username;
		user.website = req.body.website;
		user.bio = req.body.bio;

		await user.save();

		console.log("User after updating", user);

		user = await user
			.populate("followers", "-password")
			.populate("following", "-password")
			.populate("suggestions", "-password")
			.execPopulate();

		return res.status(200).json({
			message: "Profile updated successfully!",
			data: {
				updated_profile: user,
				token: jwt.sign(user.toJSON(), env.jwt_secret, { expiresIn: "1000000" }),
			},
			success: true,
		});
	} catch (error) {
		return res.status(500).json({
			message: "Error in updating profile!",
		});
	}
};

module.exports.changeProfile = async function (req, res) {
	try {
		let user = await User.findById(req.user._id);
		user.avatar = req.body.profileUrl;
		await user.save();

		user = await user
			.populate("followers", "-password")
			.populate("following", "-password")
			.populate("suggestions", "-password")
			.execPopulate();

		return res.status(200).json({
			message: "Profile updated successfully!",
			data: {
				updated_profile: user,
				token: jwt.sign(user.toJSON(), env.jwt_secret, { expiresIn: "1000000" }),
			},
			success: true,
		});
	} catch (error) {
		return res.status(500).json({
			message: "Error in updating profile!",
		});
	}
};

module.exports.delete = async function (req, res) {
	if (req.user.id === req.params.id) {
		try {
			// delete all the posts of that user
			await Post.deleteMany({ user: req.user._id });

			// delete all the comments of that user
			await Comment.deleteMany({ user: req.user._id });

			// delete all the likes from that user
			await Like.deleteMany({ user: req.user._id });

			// delete that user from reset pass token
			await ResetPassToken.deleteMany({ user: req.user._id });

			// delete follwers, following, suggestion from User

			let update = {
				$pull: {
					followers: { _id: req.user._id },
					following: { _id: req.user._id },
					suggestions: { _id: req.user._id },
				},
			};

			await User.updateMany({}, update);

			await User.findByIdAndDelete(req.user._id);

			return res.status(200).json({
				message: "Account has been deleted!",
				success: true,
			});
		} catch (error) {
			return res.status(500).json(error);
		}
	} else {
		return res.status(403).json({
			message: "You are not authorized!",
		});
	}
};

module.exports.changePassword = async function (req, res) {
	try {
		let user = await User.findById(req.user._id);

		console.log("user password", User);
		console.log("body password", req.body.old_password);

		if (
			req.body.old_password !== user.password ||
			req.body.new_password !== req.body.confirm_password
		) {
			return res.status(403).json({
				message: "Wrong Password!",
			});
		}

		user.password = req.body.new_password;
		await user.save();

		user = await user
			.populate("followers", "-password")
			.populate("following", "-password")
			.populate("suggestions", "-password")
			.execPopulate();

		return res.status(200).json({
			message: "Your password has been changed!",
			success: true,
			data: {
				user,
				token: jwt.sign(user.toJSON(), env.jwt_secret, { expiresIn: "1000000" }),
			},
		});
	} catch (error) {
		return res.status(500).json(error);
	}
};

module.exports.follow = async function (req, res) {
	if (req.user.id === req.params.id) {
		return res.status(403).json({
			message: "You can't follow yourself!",
		});
	} else {
		try {
			let toFollowUser = await User.findById(req.params.id);
			let currentUser = await User.findById(req.user.id);

			console.log("toFollowUser", toFollowUser);
			console.log("currentUser", currentUser);

			// if user does not already follows toFollowUSer
			if (!toFollowUser.followers.includes(req.user.id)) {
				await toFollowUser.followers.push(req.user.id);
				await currentUser.following.push(req.params.id);

				await toFollowUser.save();
				await currentUser.save();

				console.log("toFollowUser1", toFollowUser);
				console.log("currentUser1", currentUser);

				toFollowUser = await toFollowUser
					.populate("followers", "-password")
					.populate("following", "-password")
					.execPopulate();

				currentUser = await currentUser
					.populate("followers", "-password")
					.populate("following", "-password")
					.populate("suggestions", "-password")
					.execPopulate();

				return res.status(200).json({
					message: "You started following this user!",
					success: true,
					data: {
						updated_profile: toFollowUser,
						token: jwt.sign(currentUser.toJSON(), env.jwt_secret, {
							expiresIn: "1000000",
						}),
					},
				});
			} else {
				return res.status(403).json({
					message: "You already follow this user",
				});
			}
		} catch (error) {
			console.log("Error", error);
			return res.status(500).json({
				message: error,
			});
		}
	}
};

module.exports.unfollow = async function (req, res) {
	if (req.user.id === req.params.id) {
		return res.status(403).json({
			message: "You can't unfollow yourself!",
		});
	} else {
		try {
			let toUnFollowUser = await User.findById(req.params.id);
			let currentUser = await User.findById(req.user.id);

			if (toUnFollowUser.followers.includes(req.user.id)) {
				await toUnFollowUser.followers.pull(req.user.id);
				await currentUser.following.pull(req.params.id);

				await toUnFollowUser.save();
				await currentUser.save();

				toUnFollowUser = await toUnFollowUser
					.populate("followers", "-password")
					.populate("following", "-password")
					.execPopulate();

				currentUser = await currentUser
					.populate("followers", "-password")
					.populate("following", "-password")
					.populate("suggestions", "-password")
					.execPopulate();

				return res.status(200).json({
					message: "You have unfollowed this user!",
					success: true,
					data: {
						updated_profile: toUnFollowUser,
						token: jwt.sign(currentUser.toJSON(), env.jwt_secret, {
							expiresIn: "1000000",
						}),
					},
				});
			} else {
				return res.status(403).json({
					message: "You do not follow this user",
				});
			}
		} catch (error) {
			return res.status(500).json({
				message: error,
			});
		}
	}
};

module.exports.fetchSuggestions = async function (req, res) {
	if (req.user.id == req.params.id) {
		try {
			let currUser = await User.findById(req.user._id);

			let meAndfollowingsArray = currUser.following;
			await meAndfollowingsArray.push(req.user._id);

			let suggestionList = await User.find(
				{ _id: { $nin: meAndfollowingsArray } },
				{ password: 0 }
			);

			return res.status(200).json({
				message: "Fetch Suggestion list successfully!",
				success: true,
				data: {
					suggestions: suggestionList,
				},
			});
		} catch (error) {
			return res.status(500).json({
				message: "Internal Server Error!",
			});
		}
	} else {
		return res.status(403).json({
			message: "You are not authorized!",
		});
	}
};
