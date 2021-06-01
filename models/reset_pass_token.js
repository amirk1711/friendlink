const mongoose = require('mongoose');

const resetPassTokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    accessToken: {
        type: String,
        required: true
    },
    isValid: {
        type: Boolean,
        required: true
    }
}, {
    timestamps: true
});

const ResetPassToken = mongoose.model('ResetPassToken', resetPassTokenSchema);
module.exports = ResetPassToken;