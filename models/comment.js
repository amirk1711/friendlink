const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: {
        typE: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'User'
    },
    post: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'Post'
    }
}, {
    timestamps: true
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;