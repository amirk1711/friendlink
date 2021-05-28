const express = require('express');
const router = express.Router();
const passport = require('passport')

const userController = require('../controllers/users_controller');

router.get('/sign-up', userController.signUp);
router.get('/sign-in', userController.signIn);
router.get('/sign-out', userController.destroySession);
router.post('/create', userController.create);

// use passpot as a middleware to authenticate
// authenitcate is an in-built function
router.post(
    '/create-session', 
    passport.authenticate('local', {failureRedirect: '/users/sign-in'}),
    userController.createSession
);

router.post('/update/:id', passport.checkAuthentication, userController.update);
router.get('/profile/:id', passport.checkAuthentication, userController.profile);

module.exports = router;