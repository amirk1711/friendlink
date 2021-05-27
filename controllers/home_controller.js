const User = require('../models/user');
const Post = require('../models/post');

module.exports.home = function(req, res){
    // populate() function in mongoose is used 
    // for populating the data inside the reference.
    // populate the user of each post
    Post.find({}).populate('user').exec(
        function(err, posts){
            res.render('home', {
                title: 'friendlink',
                posts: posts
            });
        }
    );
}