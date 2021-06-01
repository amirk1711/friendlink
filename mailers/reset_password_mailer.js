const nodeMailer = require('../config/nodemailer');

exports.passResetToken = function(myToken){
    console.log('Inside reset pass mailer');
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
        console.log('Message sent', info);
        return; 
    });

}