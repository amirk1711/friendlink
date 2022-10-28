const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			min: 3,
			max: 20,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			min: 6,
		},
		name: {
			type: String,
			required: true,
		},
		avatar: {
			type: String,
			default: "https://cdn-icons-png.flaticon.com/512/727/727399.png",
		},
		followers: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		following: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		suggestions: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		bio: {
			type: String,
			default: "",
			max: 50,
		},
		website: {
			type: String,
			default: '',
		}
	},
	{
		timestamps: true,
	}
);

const User = mongoose.model("User", userSchema);
module.exports = User;
