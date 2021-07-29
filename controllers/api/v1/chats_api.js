const Chat = require("../../../models/chat");

module.exports.home = async function (req, res) {
	try {
		console.log("inside func");
		// const chat = new Chat(req.body);
		const chat = await Chat.create(req.body);
		console.log("new chat created", chat);

		await chat.save();

		// chat = await chat.populate("sender", "-password").populate("chatUserId");
		chat = await chat.populate("sender", "-password").populate("chatUserId").execPopulate();
		console.log("chat", chat);

		return res.status(200).json({
			message: "Chat created successfully",
			success: true,
			data: {
				chat,
			},
		});
	} catch (error) {
		return res.status(500).json(error);
	}
};

module.exports.getChats = async function (req, res) {
	try {
		const chats = await Chat.find({ chatUserId: req.params.chatUserId })
			.populate("sender", "-password")
			.populate("chatUserId");

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
