const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");
const Like = require("../models/like");
const env = require("../config/environment");

const genUsername = require("unique-username-generator");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(env.google_client_id);


module.exports.signup = async function (req, res) {
	// find user by email
	User.findOne({ email: req.body.email }, function (err, user) {
		if (err) {
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

module.exports.login = async function (req, res) {
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
		return res.status(500).json({
			message: err,
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

		return res.status(200).json({
			message: "User profile fetched successfully!",
			data: {
				profile_user: user,
				profile_posts: userPost,
			},
			success: true,
		});
	} catch (err) {
		return res.status(500).json({
			message: err,
		});
	}
};

module.exports.update = async function (req, res) {
	try {
		let user = await User.findById(req.user._id);

		user.name = req.body.name;
		user.username = req.body.username;
		user.website = req.body.website;
		user.bio = req.body.bio;

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
			message: err,
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
			message: err,
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
		} catch (err) {
			return res.status(500).json(err);
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
	} catch (err) {
		return res.status(500).json(err);
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

			// if user does not already follows toFollowUSer
			if (!toFollowUser.followers.includes(req.user.id)) {
				await toFollowUser.followers.push(req.user.id);
				await currentUser.following.push(req.params.id);

				await toFollowUser.save();
				await currentUser.save();

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
		} catch (err) {
			return res.status(500).json({
				message: err,
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

module.exports.checkUsername = async function (req, res) {
	try {
		let user = await User.findOne({ username: req.body.username });
		if (user) {
			return res.status(200).json({
				message: "Username is not unique.",
				success: true,
				isUnique: false,
			});
		}
		return res.status(200).json({
			message: "Username is unique.",
			success: true,
			isUnique: true,
		});
	} catch (error) {
		console.log("error", error);
		return res.status(500).json({
			message: "Internal Server Error!",
		});
	}
};