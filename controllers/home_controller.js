const User = require('../models/user');
const Post = require('../models/post');

module.exports.home = async function(req, res){
    // populate() function in mongoose is used 
    // for populating the data inside the reference.
    // populate the user of each post

    try {
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')//populate user of each post
        .populate({
            path: 'comments',//populate comments of each post
            populate: {
                path: 'user'//populate user from comments
            },
            populate: {
                path: 'likes'//populate likes from comments
            }
        })
        // .populate('comments')
        .populate('likes'); // populate likes of post
        
        // console.log('posts: ', posts);

        let users = await User.find({});

        return res.render('home', {
            title: 'friendlink | Home',
            posts: posts,
            // to show friends list
            all_users: users
        });
    } catch (err) {
        console.log(`Error: ${err}`);
        return;
    }
}