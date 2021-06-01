const User = require('../models/user');
const ResetPassToken = require('../models/reset_pass_token');
const crypto = require('crypto');
// inbuilt crypto 
// const crypto = require('node:crypto');

const nodemailer = require('../config/nodemailer');
const resetPasswordMailer = require('../mailers/reset_password_mailer');
const queue = require('../config/kue');
const resetPasswordEmailWorker = require('../workers/reset_password_email_worker');

module.exports.forgotPassword = function(req, res){
    return res.render('forgot_password', {
        title: 'Forgot password'
    });
}

module.exports.confirmEmail = async function(req, res){
    try {
    // get the email of user
    const email = req.body.email;
    console.log('email', email);

    let user = await User.findOne({email: email});
        if(user){
            // generate access token for email using crypto
            const accessToken = crypto.randomBytes(20).toString('hex');
            console.log('accessToken', accessToken);

            const token = await ResetPassToken.create({
                user: user._id,
                accessToken: accessToken,
                isValid: true
            });

            const myToken = await token.populate('user' , 'name email').execPopulate() ; 
            console.log('myToken', myToken) ;

            // resetPasswordMailer.passResetToken(myToken);
            let job = queue.create('resetPasswordEmails', myToken).priority('medium').save(function(err){
                if(err){
                    console.log('error in creating a queue for password reset', err);
                    return;
                }

                console.log('job enqueued', job.id);
            });

            req.flash('success' , 'Password Reset Link has been sent to the user!!');
            return res.redirect('back');
        }else{
            console.log('User not found');
            req.flsh('error', 'User not found');
            return res.redirect('back');
        }
            
    } catch (err) {
        req.flash('error' , err);
        return res.redirect('back');
    }
}

module.exports.reset = async function(req, res){
    // console.log('req.query', req.query);
    // console.log('req.params', req.params);

    try {
        let token = req.query.accessToken;

        let accessToken = await ResetPassToken.findOne({accessToken: token});

        // console.log('accessToken', accessToken);

        if(accessToken && accessToken.isValid){
            return res.render('reset_password' , {
                title: 'Reset Password',
                accessToken: token,
            });
        }else{
            req.flash('error' , "Unauthorized !");
            return res.redirect('back');
        }
    } catch (err) {
        req.flash('error', err);
        return;
    }
}

module.exports.resetPassword = async function(req, res){    
    try {
        if(req.body.password != req.body.confirm_password){
            req.flash('error', 'Passwords do not match!');
            return;
        }

        let token = req.body.accessToken;
        let accessToken = await ResetPassToken.findOne({accessToken: token});        

        if(accessToken && accessToken.isValid){
            let user = await User.findById(accessToken.user);
            if(user.password == req.body.password){
                req.flash('error', 'enter new password');
                return res.redirect('back');
            }

            user.password = req.body.password;
            await user.save();

            accessToken.isValid = false;
            accessToken.remove();

            req.flash('success' , "Password Reset Successfull!");
            return res.redirect('/users/sign-in');
        }else{
            req.flash('error' , "You are not authorized to reset the password!");
            return res.redirect('back');
        }
    } catch (err) {
        req.flash('error', err);
        return;
    }
}