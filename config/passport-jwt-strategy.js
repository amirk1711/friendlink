const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt; // to extract JWT from headers

const env = require('./environment');
const User = require('../models/user');

let opts = {
    ignoreExpiration: true,
    // to extract token inside header > auth > bearer
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    // key to encrypt and decrypt token
    secretOrKey: env.jwt_secret,
};

passport.use(new JWTStrategy(opts, function(jwtPayload, done){
    // find user based on the payload
    User.findById(jwtPayload._id, function(err, user){
        if(err){
            console.log('Error in finding user form JWT payload');
            return;
        }

        if(user){
            return done(null, user);
        }
        else{
            return done(null, false);
        }
    });
}));

module.exports = passport;