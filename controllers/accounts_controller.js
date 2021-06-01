const User = require('../models/user');
const ResetPassToken = require('../models/reset_pass_token');
const crypto = require('crypto');
// inbuilt crypto 
// const crypto = require('node:crypto');

const nodemailer = require('../config/nodemailer');
const resetPasswordMailer = require('../mailers/reset_password_mailer');

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
            resetPasswordMailer.passResetToken(myToken);
            // let resetURL = `localhost:8000/accounts/reset/?accessToken=${accessToken}`;
            req.flash('sucess' , 'Password Reset Link has been sent to the user!!');
            console.log('Password Reset Link has been sent to the user!!');
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