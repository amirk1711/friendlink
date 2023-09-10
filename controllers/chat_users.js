const ChatUser = require("../models/chat_user");

// create users to chat with them
module.exports.home = async function (req, res) {
	try {
		const chatUser = await ChatUser.findOne({
			connections: { $all: [req.body.senderId, req.body.receiverId] },
		}).populate("connections", "-password");

		if(chatUser){
			return res.status(200).json({
				message: "Chat user is returned!",
				data: {
					chatUser,
				},
				success: true,
				alreadyExist: true
			});
		}

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
			alreadyExist: false,
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

module.exports.getChatUser = async function (req, res) {
	try {
		const chatUser = await ChatUser.findOne({
			connections: { $all: [req.params.firstUserId, req.params.secondUserId] },
		}).populate("connections", "-password");

		return res.status(200).json({
			message: "Fetched Chat User Successfully for Online Users",
			success: true,
			data: {
				chatUser,
			},
		});
	} catch (error) {
		return res.status(500).json(error);
	}
};
