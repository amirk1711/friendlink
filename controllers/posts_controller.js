const Post = require('../models/post');
const Comment = require('../models/post');

module.exports.create = function(req, res){
    Post.create({
        content: req.body.content,
        user: req.user._id
    }, function(err, user){
        if(err){
            console.log('Error in creating post', err);
            return;
        }
        return res.redirect('back');
    });
}


module.exports.destroy = function(req, res){
    Post.findById(req.params.id, function(err, post){
        // .id means converting the object id into string
        if(post.user == req.user.id){
            post.remove();

            Comment.deleteMany({post: req.params.id}, function(err){
                if(err){
                    console.log('Error in deleting Comments associated with the post');
                    return;
                }
                return res.redirect('back');
            });
        }else{
            console.log('You cannot delete this post');
            return res.redirect('back');
        }
    });
}