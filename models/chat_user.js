const mongoose = require('mongoose');

const chatUserSchema = new mongoose.Schema({
    connections: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
}, {
    timestamps: true
});

const ChatUser = mongoose.model('ChatUser', chatUserSchema);
module.exports = ChatUser;