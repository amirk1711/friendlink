// passport will use this defined strategy to authenticate requests

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

passport.use(new LocalStrategy({
        usernameField: 'email',
        passReqToCallback: true
    },
    function(req, email, password, done){
        User.findOne({email: email}, function(err, user){
            if(err){
                console.log('Error in finding user --> passport', err);
                return done(err);
            }

            if(!user || user.password != password){
                console.log('Invalid username/password');
                return done(null, false);
            }

            return done(null, user);
        });
    }
));


// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user, done){
    done(null, user.id);
});


// deserializing the user from the key in the cookies
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err){
            console.log('Error in finding user --> passport');
            return done(err);
        }

        return done(null, user);
    });
});


// check if user is authenticated
passport.checkAuthentication = function(req, res, next){
    // if the user is signed in, then pass on the req to the next fun(controller's action)
    if(req.isAuthenticated()){
        return next();
    }

    // if user is not signed in
    return res.redirect('/users/sign-in');
}


passport.setAuthenticatedUser = function(req, res, next){
    // if user is signed in
    if(req.isAuthenticated()){
        // req.user contains the current signed in user from the session cookie and we are just sending it to the locals of the views
        res.locals.user = req.user;
    }

    next();
}

modules.export = passport;