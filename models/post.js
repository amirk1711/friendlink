const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

// this is where i'll be storing all the posts
const POST_PATH = path.join('/uploads/users/posts');

const postSchema = new mongoose.Schema({
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

// now link all three, content(which is in schema),
// POST_PATH and multer
let storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, "..", POST_PATH));
	},
	// if multiple users upload files with same name
	filename: function (req, file, cb) {
        // here fieldname is avatar in user schema
        // so our files in uploads folder will be stored as
        // 'avatar-date'
		cb(null, file.fieldname + "-" + Date.now());
	},
});

// static functions
// it is for whole user schema not for individual user
// .single(content) means only one file will be uploaded for the field content
postSchema.statics.uploadedPost = multer({ storage: storage }).single('content');
// to make POST_PATH publicly available to user schema so that we can fetch it in the controller
postSchema.statics.postPath = POST_PATH;

const Post = mongoose.model('Post', postSchema);
module.exports = Post;