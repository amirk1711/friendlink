const Post = require("../../../models/post");
const Comment = require("../../../models/comment");

module.exports.home = async function (req, res) {
	let posts = await Post.find({})
		.populate("user")
		.populate({
			path: "comments",
			populate: {
				path: "user likes",
			},
		})
		.populate("likes");

	return res.json(200, {
		message: "List of posts",
		posts: posts,
		success: true,
	});
};

module.exports.create = async function (req, res) {
	try {
		// create post
		// console.log("from post_api", req.body);
		// console.log("user id", req.user);
		let post = await Post.create({
			user: req.user.id,
			content: req.body.content,
			contentType: req.body.contentType,
		});

		console.log("post", post);

		if (req.xhr) {
			console.log("Create Post using AJAX");
			// to populate just the name of the user (we'll not want to send the password in the API)
			post = await post.populate("user", "name").execPopulate();
			console.log("post to ajax", post);
			return res.status(200).json({
				data: {
					post: post,
				},
				message: "Post created using AJAX!",
			});
		}

		req.flash("success", "Post published!");
		return res.status(200).json({
			data: {
				post: post,
			},
			message: "Post created!",
			success: true,
		});
	} catch (error) {
		req.flash("error", "Error in creating Post");
		return res.status(500).json({
			message: "Internal server error",
		});
	}
};

module.exports.destroy = async function (req, res) {
	try {
		let post = await Post.findById(req.params.id);

		if (post.user == req.user.id) {
			post.remove();

			// delete comments on that post
			await Comment.deleteMany({ post: req.params.id });

			return res.status(200).json({
				message: "Post and associated comments deleted successfully",
				success: true,
			});
		} else {
			return res.status(401).json({
				message: "You are not authourized to delete this post!",
			});
		}
	} catch (err) {
		console.log("Error in deleting post******:", err);
		return res.status(500).json({
			message: "Internal server error",
		});
	}
};
