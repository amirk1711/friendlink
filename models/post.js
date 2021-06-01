const mongoose = require('mongoose');

const postScehma = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    // link post to the user
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // include the arrays of ids of all the
    // comments in this post schema itself
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Like'
        }
    ]
}, {
    timestamps: true
});

const Post = mongoose.model('Post', postScehma);
module.exports = Post;