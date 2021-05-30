const mongoose = require('mongoose');
const { schema } = require('../../codeial/models/user');
const multer = require('multer');
const path = require('path');

// this is where i'll be storing all the avatars
const AVATAR_PATH = path.join('/uploads/users/avatar');


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    }
}, {
    timestamps: true
});

// now link all three, avatar(which is in schema),
// AVATAR_PATH and multer to mak esure that
let storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, "..", AVATAR_PATH));
	},
	// if multiple users upload files with same name
	filename: function (req, file, cb) {
		cb(null, file.fieldname + "-" + Date.now());
	},
});

// static functions
// it is for whole user schema not for individual user
userSchema.statics.uploadedAvatar = multer({ storage: storage }).single('avatar');
// to make AVATAR_PATH publicly available to user schema
userSchema.statics.avatarPath = AVATAR_PATH;

const User = mongoose.model('User', userSchema);
module.exports = User;