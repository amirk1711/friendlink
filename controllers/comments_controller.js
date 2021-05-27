const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = function(req, res){
    Post.findById(req.body.post, function(err, post){
        if(err){
            console.log('Error in finding post', err)
        }
        if(post){
            Comment.create({
                content: req.body.content,
                post: req.body.post,
                user : req.user._id
            }, function(err, comment){
                if(err){
                    console.log('Error in creating comment', err);
                    return;
                }

                // if comment is created add this
                // comment to the post's comments array
                post.comments.push(comment);
                // save after upadte
                post.save();
            });
        }

        res.redirect('back');
    });
};