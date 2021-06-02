const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const env = require('./environment');

const User = require('../models/user');

// tell the passport to use a new strategy for google login
passport.use(new googleStrategy(
    {
        clientID: env.google_client_id,
        clientSecret: env.google_client_secret,
        callbackURL: env.google_callback_url,
    },
    // callback function
    function(accesstoken, refreshToken, profile, done){
        console.log('access token:', accesstoken);
        console.log('refresh token:', refreshToken);
        // find user
        // Google can have multiple emails
        User.findOne({email: profile.emails[0].value}).exec(function(err, user){
            if(err){
                console.log('error in google strategy-passport', err);
                return;
            }

            console.log('Profile: ', profile);

            if(user){
                // if found, set the user as req.user or sign in the user
                return done(null, user);
            }else{
                // create user and sign in
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                }, function(err, user){
                    if(err){
                        console.log('error in creating user in google auth', err);
                        return;
                    }

                    return done(null, user);
                });
            }
        });
    }
));


module.exports = passport;