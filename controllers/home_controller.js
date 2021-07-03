const User = require('../models/user');
const Post = require('../models/post');

module.exports.home = async function(req ,res){
    try {   
            // Find all the posts and populate referenced documents
            // so that posts can be displayed on the home screen
            // with details like user(owner of the post), comments and likes 
            let posts = await Post.find({})
            .populate('user')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user likes'
                }
            }).populate('likes');

            // console.log('posts.comments:', posts);
            
            // Find all the users to show the list of all the users
            let users = await User.find({});

            let usersFriendships;
            
            // if user is logged in, find his friendships
            if(req.user){
                usersFriendships = await User.findById(req.user._id)
                .populate({
                    path: 'friendships',
                    populate: {
                        path: 'from_user'
                    },
                    populate: {
                        path: 'to_user'
                    }
                });
            }
            
            // console.log('usersFriendships', usersFriendships);

            // send all the posts, users, and friendships to the view
            return res.render('home' , {
                title: "Friendlink | Home",
                posts: posts,
                all_users: users,
                my_friends: usersFriendships
            });

    } catch (error) {
        console.log("Error : " , error);
        return;
    }
}