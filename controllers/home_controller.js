const User = require('../models/user');
const Post = require('../models/post');

module.exports.home = async function(req, res){
    // populate() function in mongoose is used 
    // for populating the data inside the reference.
    // populate the user of each post

    try {
        let posts = await Post.find({})
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        });

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