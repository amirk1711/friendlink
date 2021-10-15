// const Comment = require('../models/comment');
// const Post = require('../models/post');
// const Like = require('../models/like');

// module.exports.create = async function(req, res){
//     try {
//         // find post on which comment is to be created
//         let post = await Post.findById(req.body.post) ;

//         if(post){
//             // if post is found, create a comment
//             let comment = await Comment.create({
//                 content: req.body.content,
//                 // post: post
//                 post: req.body.post,
//                 user: req.user._id
//             });

//             //add comment id(comment) to the post's comments array
//             post.comments.push(comment);

//             // save after every update
//             post.save();

//             // populate name and email from Comment model to send mail to the required user
//             comment = await comment.populate('user' , 'name email').execPopulate();

//             //create a new job in the queue
//             // let job = queue.create('emails' , comment).priority('low').save(function(err){
//             //     if(err){
//             //         console.log("Error in sending comment mail to the queue: ", err);
//             //         return;
//             //     }
//             //     console.log('Job enqueued with job id: ' , job.id);
//             // });

//             if(req.xhr){
//                 console.log("AJAX Request");
//                 return res.status(200).json({
//                     data: {
//                         comment: comment,
//                     },
//                     message: "Comment Created using AJAX!"
//                 });
//             }else{
//                 req.flash('success', "Comment Created!")
//                 return res.redirect('/');
//             }
//         }
//     } catch (error) {
//         conole.log('Error in creating comment!', error);
//         req.flash('error', error);
//         return;
//     }
// }


// module.exports.destroy = async function(req, res){
//     try {
//         let comment = await Comment.findById(req.params.id);

//         // find the post on which comment is created
//         let postId = comment.post;
//         let commentOnPost = Post.findById(postId);

//         if(comment.user == req.user.id || commentOnPost.user == req.user.id){
//             // delete the associated likes with that comment
//             await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});

//             // delete the comment
//             comment.remove();

//             // pull/delete from the post's comments array with comment id 
//             await Post.findByIdAndUpdate(postId, {$pull: {comments: req.params.id}});         
            
//             if(req.xhr){
//                 return res.status(200).json({
//                     data: {
//                         comment_id: req.params.id
//                     },
//                     message: "Comment Deleted !"
//                 });
//             }
//         }
//         req.flash('success', "Comment Deleted!");
//         return res.redirect('back');
//     } catch (error) {
//         req.flash('error', error);
//         return res.redirect('back');  
//     }
// }