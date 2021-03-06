const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
	{
		content: {
			type: String,
			required: true,
		},
		contentType: {
			type: String,
			required: true,
		},
		caption: {
			type: String,
			default: "",
			max: 500,
		},

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
				ref: "User",
			},
		],
	},
	{
		timestamps: true,
	}
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
