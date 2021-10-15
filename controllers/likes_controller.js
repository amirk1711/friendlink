// const Like = require('../models/like');
// const Post = require('../models/post');
// const Comment = require('../models/comment');

// module.exports.toggleLike = async function(req,res){
//     try {
//         // routes will be like this- likes/toggleLike/?id=abcdxyz&type=post
//         let likeable;
//         let deleted = false ; // will indicate if a liek has been delted or created

//         if(req.query.type == 'Post'){
//             // if it is a like on a post
//             likeable = await Post.findById(req.query.id).populate('likes');
//         }else{
//             // if it is a like on a comment
//             likeable = await Comment.findById(req.query.id).populate('likes');
//         }

//         // likeable = that Post or Comment on which like is created
//         // with likes populated
//         // check for an existing like
//         let existingLike = await Like.findOne({
//             likeable: req.query.id,
//             onModel: req.query.type,
//             user: req.user._id
//         });


//         if(existingLike){
//             // pull/delete the like from likeable(which is Post/Comment)
//             // which has id as existingLike._id
//             likeable.likes.pull(existingLike._id);
//             // update that model by saving
//             likeable.save();
//             // delete the existed like
//             await existingLike.remove();
//             deleted = true;
//         }else{
//             // create a new like
//             newLike = await Like.create({
//                 user : req.user._id ,
//                 likeable : req.query.id ,
//                 onModel : req.query.type
//             });

//             likeable.likes.push(newLike._id);
//             likeable.save();
//         }   

//         return res.status(200).json({
//             message: "Request Sucessfull!" ,
//             data: {
//                 deleted: deleted
//             }
//         });

//     } catch (error) {
//         console.log('Error in toggling like: ', error);
//         return res.json(500, {
//             message: 'Internal Server Error'
//         });
//     }
// }