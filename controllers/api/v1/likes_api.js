const Like = require("../../../models/like");
const Post = require("../../../models/post");
const Comment = require("../../../models/comment");

module.exports.toggleLike = async function (req, res) {
	try {
		// routes will be like this- likes/toggleLike/?id=abcdxyz&type=post
		let likeable;
		let deleted = false; // will indicate if a like has been deleted or created

		if (req.query.type == "Post") {
			// if it is a like on a post
			likeable = await Post.findById(req.query.id).populate("likes");
		} else {
			// if it is a like on a comment
			likeable = await Comment.findById(req.query.id).populate("likes");
		}


		// check if user already liked
		if(likeable.likes.includes(req.user._id)){
			console.log('if already liked');
			await likeable.updateOne({$pull: {likes: req.user._id}});
			// await likeable.likes.pull(req.user._id);
			// await likeable.save();
			deleted = true;
			console.log('likeable after deleting', likeable);
		} else {
			console.log('if it is new like');
			await likeable.likes.push(req.user._id);
			await likeable.save();
			console.log('likeable after insrting', likebale);
		}


		return res.status(200).json({
			message: "Request Sucessfull!",
			success: "true",
			data: {
				deleted: deleted,
			},
		});
	} catch (error) {
		console.log("Error in toggling like here: ", error);
		return res.json(500, {
			message: "Internal Server Error!",
		});
	}
};

module.exports.fetchLikes = async function (req, res) {
	try {
		// routes will be like this- likes/toggleLike/?id=abcdxyz&type=post
		let likeable;

		if (req.query.type == "Post") {
			// if it is a like on a post
			likeable = await Post.findById(req.query.id).populate("likes");
		} else {
			// if it is a like on a comment
			likeable = await Comment.findById(req.query.id).populate("likes");
		}

		return res.status(200).json({
			message: "Request Sucessfull!",
			success: "true",
			data: {
				likeable: likeable,
			},
		});
	} catch (error) {
		console.log("Error in fetching likes: ", error);
		return res.json(500, {
			message: "Internal Server Error!",
		});
	}
};
