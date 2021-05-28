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

module.exports.destroy = function(req, res){
    Comment.findById(req.params.id,function(err, comment){
        if(err){
            console.log('Error in finding comment to be deleted');
            return;
        }
        let postId = comment.post;
        Post.findById(postId, function(err, post){
            if(err){
                console.log('Error in finding post on which comment is created');
                return;
            }
            if(comment.user == req.user.id || post.user == req.user.id){
                comment.remove();
                Post.findByIdAndUpdate(postId, {$pull: {comments: req.params.id}}, function(err, post){
                    if(err){
                        return res.redirect('back');
                    }
                });
                return res.redirect('back');
            }else{
                return res.redirect('back');
            }
        });
    });
}