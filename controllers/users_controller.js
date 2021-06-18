const User = require("../models/user");
const fs = require("fs");
const path = require("path");

module.exports.profile = async  function(req ,res){
    try {
        let user = await User.findById(req.params.id);
        let usersFriendships;

        if(req.user){
            usersFriendships = await User.findById(req.user._id).populate({ 
                path : 'friendships',
                populate: {
                    path: 'from_user'
                },
                populate: {
                    path: 'to_user'
                }
            });
        }

        let isFriend = false;
        for(friendships of usersFriendships.friendships ){
            if(friendships.from_user.id == user.id || friendships.to_user.id == user.id ){
                isFriend = true ;
                break;
            }
        }

        return res.render('user_profile' , {
            title : `${user.name} | Profile`,
            profile_user: user,
            my_friends : usersFriendships ,
            is_friend : isFriend
        });
    } catch (err) {
        console.log(err);
        return;
    }
}

module.exports.update = async function(req,res){
    if(req.user.id == req.params.id){
        try {
            let user = await User.findById(req.user.id);
            User.uploadedAvatar(req,res,function(err){
                if(err){
                    console.log("*****Multer Error***** :" , err);
                }

                user.name = req.body.name;
                user.email = req.body.email;

                // if user is sending a file in req
                console.log(req.file);
                if(req.file){
                    
                    // check if a user already has an avatar 
                    // and that avatar file exist in the dir
                    // then delete both filepath and avatarr
                    if(user.avatar && fs.existsSync(path.join(__dirname , ".." , user.avatar))){
                        fs.unlinkSync(path.join(__dirname , ".." , user.avatar));
                    }
                    
                    // save the path of the uploaded file into the avatar field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                
                }
                user.save();
                return res.redirect('back');
            })

        } catch (error) {
            req.flash('error' , error);
            return res.redirect('back');
        }

    }else{
        req.flash('error' , 'Unauthorized !');
        return res.status(401).send("Unauthorized!");
    }
}

module.exports.signUp = function (req , res) {
    // if user is signed in, redirect to profile page
    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    // otherwise redirect to sign up page
    return res.render('user_sign_up' , {
        title : "Friendlink | Sign Up",
    });

}

module.exports.signIn = function (req , res) {
    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    
    return res.render('user_sign_in' , {
        title: "Friendlink | Sign In"
    });

}

// Get the signup data, sent by user 
module.exports.create = function (req , res) {
    //check if the password and confirm_password matches or not 
    if(req.body.password != req.body.confirmPassword){
        console.log("Passwords do not match!");
        return res.redirect('back');
    }

    // find user by email
    User.findOne({email : req.body.email} , function (err,user) {
        if(err){
            console.log("Error in finding user!");
            return;
        }

        // if user is not found, create a new user
        if(!user){
            User.create(req.body, function(err, user){
                if(err){
                    req.flash('error in creating user ', err);
                    return;
                }
                
                req.flash('success', 'You have signed up, sign in to continue!');
                return res.redirect('/users/sign-in');
            });
        }else{
            req.flash('success', 'You have already signed up, login to continue!');
            return res.redirect('back');
        }
    });
}

//sign in and create a session for the user
module.exports.createSession = function (req, res) {
    req.flash('success' , 'Logged in sucessfuly!');
    return res.redirect('/');
}

module.exports.destroySession = function(req , res){
    req.logout();
    req.flash('success' , 'You have logged out!');
    return res.redirect('/');
}