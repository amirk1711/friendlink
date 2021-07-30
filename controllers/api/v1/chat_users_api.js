const ChatUser = require("../../../models/chat_user");

// create users to chat with them
module.exports.home = async function (req, res) {
	try {
		let newChatUser = await new ChatUser({
			connections: [req.body.senderId, req.body.receiverId],
		});

		await newChatUser.save();

		newChatUser = await newChatUser.populate("connections", "-password").execPopulate();

		return res.status(200).json({
			message: "New chat user is crrated!",
			data: {
				newChatUser,
			},
			success: true,
		});
	} catch (error) {
		return res.status(500).json(error);
	}
};

// get chat users list of a user
module.exports.getChatUsers = async function (req, res) {
	try {
		const chatUsers = await ChatUser.find({
			connections: { $in: [req.params.id] },
		}).populate("connections", "-password");

		return res.status(200).json({
			message: "Fetched Chat Users Successfully",
			success: true,
			data: {
				chatUsers,
			},
		});
	} catch (error) {
		return res.status(500).json(error);
	}
};
