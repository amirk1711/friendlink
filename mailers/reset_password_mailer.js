const nodeMailer = require('../config/nodemailer');
const ResetPassTokens = require('../models/reset_pass_token');


exports.passResetToken = async function(myToken){
    myToken = await ResetPassTokens.findById(myToken._id).populate('user', 'name email');
    // console.log('Inside reset pass mailer, myToken', myToken);
    let htmlString = nodeMailer.renderTemplate({token: myToken}, '/accounts/reset_password.ejs');

    console.log('email from token', myToken.user.email);

    nodeMailer.transporter.sendMail({
        from: 'friendlinkhelp@gmail.com',
        to: myToken.user.email,
        subject: 'Friendlink | Reset Password',
        html: htmlString,
    }, function(err, info){
        if(err){
            console.log('Error in sending mail', err);
            return;
        }
        console.log('Message sent');
        return; 
    });

}