const User = require("../models/user");

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
    return res.redirect('/');
};

module.exports.destroySession = function(req, res){
    req.logout();
    return res.redirect('/');
};

module.exports.update = function(req, res){
    if(req.user.id == req.params.id){
        let user = User.findById(req.params.id, function(err, user){
            if(err){
                console.log('Error in finding user');
                return;
            }

            user.name = req.body.name;
            user.save();
            return res.redirect('/');
        });
    }
};

module.exports.profile = function(req, res){
    User.findById(req.params.id, function(err, user){
        if(err){
            console.log('Erro rin finding user');
            return;
        }
        return res.render('user_profile', {
            title: `${user.name} | Profile`,
            profile_user: user
        });
    });
};