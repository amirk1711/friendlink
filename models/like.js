const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId
    },
    // this defines the object id of liked object
    // it's value could be either post.id or comment.id
    likeable: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'onModel'
    },
    // this field is used for defining the type of 
    // the liked object since it is dynamic reference
    // it's value could be either Post or Comment
    onModel: {
        type: String,
        required: true,
        enum: ['Post', 'Comment'] 
    }
}, {
    timestamps: true
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;