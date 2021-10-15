const Comment = require("../../../models/comment");
const Post = require("../../../models/post");

module.exports.create = async function (req, res) {
	try {
		// find post on which comment is to be created
		let post = await Post.findById(req.body.post);

		if (post) {
			console.log('req from comment', req.user);
			// if post is found, create a comment
			let comment = await Comment.create({
				content: req.body.content,
				// post: post
				post: req.body.post,
				user: req.user._id,
			});

			//add comment id(comment) to the post's comments array
			post.comments.push(comment);

			// save after every update
			post.save();

			// populate name and email from Comment model to send mail to the required user
			comment = await comment.populate("user", "name email avatar username").populate("post", "user").execPopulate();

			return res.status(200).json({
				data: {
					comment: comment,
				},
				success: true,
				message: "Comment Created!",
			});
		}
	} catch (error) {
		conole.log("Error in creating comment!", error);
		return res.status(500).json({
			message: "Internal Server Error!",
		});
	}
};

module.exports.destroy = async function (req, res) {
	try {		
		let comment = await Comment.findOne({_id: req.params.id});

		// find the post on which comment is created
		let postId = comment.post;

		let commentOnPost = await Post.findById(postId);

		if (comment.user == req.user.id || commentOnPost.user == req.user.id) {
			console.log('Ok');
			// delete the associated likes with that comment
			// await Like.deleteMany({ likeable: comment._id, onModel: "Comment" });

			// delete the comment
			comment.remove();

			console.log('comments deleted');

			// pull/delete from the post's comments array with comment id
			await Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } });

			return res.status(200).json({
				message: "Comment Deleted !",
				success: true,
			});
		}
		return res.status(401).json({
			message: "You cannot delete this comment!",
		});
	} catch (error) {
		return res.status(500).json({
			message: "Internal Server Error!",
		});
	}
};
