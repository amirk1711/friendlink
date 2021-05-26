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
    res.render('user_sign_up', {
        title: 'friendlink'
    });
};

module.exports.signIn = function(req, res){
    res.render('user_sign_in', {
        title: 'friendlink'
    });
};