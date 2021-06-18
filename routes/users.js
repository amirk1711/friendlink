const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersController = require('../controllers/users_controller');

router.get('/profile/:id', passport.checkAuthentication, usersController.profile);
router.get('/sign-in', usersController.signIn);
router.get('/sign-up', usersController.signUp);
router.get('/sign-out', usersController.destroySession);

router.post('/create', usersController.create);
router.post('/update/:id', passport.checkAuthentication, usersController.update);

//use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local', //strategy to be used 
    {failureRedirect : '/users/sign-in'}),
    usersController.createSession );


// route through which we will sent the req to the google for authentication
router.get('/auth/google', passport.authenticate('google' , {scope : ['profile' , 'email'] }));

// route through which google will send the data to the server
router.get('/auth/google/callback', passport.authenticate('google' , {failureRedirect : '/users/sign-in'}), usersController.createSession);

module.exports = router;