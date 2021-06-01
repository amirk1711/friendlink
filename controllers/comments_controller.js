const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require('../mailers/comments_mailer');

module.exports.create = async function(req, res){
    try {
        let post = await Post.findById(req.body.post);
        if(post){
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user : req.user._id
            });

            // if comment is created add this
            // comment to the post's comments array
            post.comments.push(comment);
            // save after upadte
            post.save();


            comment = await comment.populate('user', 'name email').execPopulate();
            commentsMailer.newComment(comment);
            if (req.xhr){    
                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Post created!"
                });
            }

            req.flash('success', 'Comment published!');

            res.redirect('back');
        }
    } catch (err) {
        req.flash('error', err);
        return;
    }
};

module.exports.destroy = async function(req, res){
    try {
        let comment = await Comment.findById(req.params.id);
        let postId = comment.post;
        let post = await Post.findById(postId);
            
        if(comment.user == req.user.id || post.user == req.user.id){
            comment.remove();
            Post.findByIdAndUpdate(postId, {$pull: {comments: req.params.id}});

            // send the comment id which was deleted back to the views
            if (req.xhr){
                
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }

            req.flash('success', 'Comment deleted!');

            return res.redirect('back');
        }else{
            req.flash('error', 'Unauthorized');
            return res.redirect('back');
        }
    } catch (err) {
        req.flash('error', err);
        return;
    }
};