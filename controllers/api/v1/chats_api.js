const Chat = require("../../../models/chat");

module.exports.home = async function (req, res) {
	try {
		const chat = new Chat(req.body);

		await chat.save();

		chat = await chat.populate("sender", "-password").populate("chatUserId").execPopulate();

		return res.status(200).json({
			message: "Chat created successfully",
			success: true,
			data: {
				chat,
			},
		});
	} catch (error) {
		return res.stateus(500).json(error);
	}
};

module.exports.getChats = async function (req, res) {
	try {
		const chats = await Chat.find({ chatUserId: req.params.chatUserId })
			.populate("sender", "-password")
			.populate("chatUSerId");

		return res.status(200).json({
			message: "Chats fetched successfully!",
			success: true,
			data: {
				chats,
			},
		});
	} catch (error) {
		return res.status(500).json(error);
	}
};
