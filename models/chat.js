const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    message: {
        type: String,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    chatUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatUser',
    }
}, {
    timestamps: true
});

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;