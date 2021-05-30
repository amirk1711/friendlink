const User = require("../models/user");
const fs = require('fs');
const path = require('path');

module.exports.create = function(req, res){
    console.log('req body', req.body);

    if(req.body.password != req.body.confirm_password){
        console.log('Passwords do not match');
        return res.redirect('back');
    }

    // check if user already exits
    User.findOne({email: req.body.email}, function(err, user){
        if(err){
            console.log('Error in finding user', err);
            return;
        }

        if(!user){
            User.create(req.body, function(err, user){
                if(err){
                    console.log('Error in creating user', err);
                    return;
                }
                return res.redirect('/');
            })
        }else{
            console.log('User already exists');
            return res.redirect('back');
        }
    });
};

module.exports.signUp = function(req, res){
    // if req is authenticated then
    // hide the sign up form
    if(req.isAuthenticated()){
        return res.redirect('/')
    }

    return res.render('user_sign_up', {
        title: 'friendlink | Sign Up'
    });
};

module.exports.signIn = function(req, res){
    // if req is authenticated then
    // hide the sign up form
    if(req.isAuthenticated()){
        return res.redirect('/')
    }

    res.render('user_sign_in', {
        title: 'friendlink | Sign In'
    });
};

// sign in and create session for the user
module.exports.createSession = function(req, res){
    req.flash('success', 'Logged In successfully');
    return res.redirect('/');
};

module.exports.destroySession = function(req, res){
    req.logout();
    req.flash('success', 'Logged Out successfully');
    return res.redirect('/');
};

module.exports.update = async function(req, res){
    if(req.user.id == req.params.id){
        try {
            let user = await User.findById(req.params.id)
            User.uploadedAvatar(req, res, function (err) {
				if (err) {
					console.log("***Multer error***: ", err);
					return;
				}

                user.name = req.body.name;

                // if user is updating file also 
                if (req.file) {
                    // check if user has already an avatar and that file is present at that path
                    // then unlink that path and file
                    if(user.avatar && fs.existsSync(path.join(__dirname, '..', user.avatar))){
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }
					// this is saving the path of the uploaded file into the avatar field in the user
					user.avatar = User.avatarPath + "/" + req.file.filename;
					// console.log(user.avatar);
				}

                user.save();
                return res.redirect('/');
            });
        }catch(err){
            req.flash("error", error);
			return res.redirect("back");
        }
    }else{
        req.flash("error", "Unauthorized!");
		return res.status(401).send("Unauthorized");
    }
};

module.exports.profile = function(req, res){
    User.findById(req.params.id, function(err, user){
        if(err){
            console.log('Error in finding user');
            return;
        }
        return res.render('user_profile', {
            title: `${user.name} | Profile`,
            profile_user: user
        });
    });
};