const Post = require("../../../models/post");
const Comment = require("../../../models/comment");

module.exports.create = async function (req, res) {
	try {
		console.log("from post_api", req.body);
		console.log("user id", req.user);

		let post = await Post.create({
			user: req.user.id,
			content: req.body.content,
			contentType: req.body.contentType,
			caption: req.body.caption,
		});

		await post.populate("user", "-password");

		console.log("Post", post);

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

// get posts(of following user) for timeline
module.exports.timelinePosts = async function (req, res) {
	try {
		const currentUser = await User.findById(req.user.id);
		const userPosts = await Post.find({ user: req.user._id });
		const followingPosts = await Promise.all(
			currentUser.following.map((followingId) => {
				return Post.find({ user: followingId });
			})
		);

		const timelinePosts = await userPosts
			.concat(...followingPosts)
			.populate("user")
			.populate({
				path: "comments",
				populate: {
					path: "user likes",
				},
			})
			.populate("likes");

		return res.status(200).json({
			message: "Timeline Posts",
			success: true,
			data: {
				timelinePosts: timelinePosts,
			},
		});
	} catch (error) {
		return res.status(500).json({
			message: "Internal Server Error!",
		});
	}
};
