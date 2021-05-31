const express = require('express');
const router = express.Router();
const passport = require('passport')

const usersController = require('../controllers/users_controller');

router.get('/sign-up', usersController.signUp);
router.get('/sign-in', usersController.signIn);
router.get('/sign-out', usersController.destroySession);
router.post('/create', usersController.create);

// use passpot as a middleware to authenticate
// authenitcate is an in-built function
router.post(
    '/create-session', 
    passport.authenticate('local', {failureRedirect: '/users/sign-in'}),
    usersController.createSession
);

router.post('/update/:id', passport.checkAuthentication, usersController.update);
router.get('/profile/:id', passport.checkAuthentication, usersController.profile);

// route through which we'll fetch the info from google
router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
// route at which we receive the data from google
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: 'users/sign-in'}), usersController.createSession);

module.exports = router;