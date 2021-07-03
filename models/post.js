const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
	{
		// content will be an image base 64
		// we will store image in base64 encoding
		content: [
			{
				type: String,
				required: true,
			},
		],
		contentType: [
			{
				type: String,
				required: true,
			},
		],
		// link post to the user
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		// include the arrays of ids of all the
		// comments in this post schema itself
		comments: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Comment",
			},
		],
		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Like",
			},
		],
	},
	{
		timestamps: true,
	}
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
