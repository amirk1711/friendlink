// const nodemailer = require('nodemailer');
// const { relative } = require('path');
// const ejs = require('ejs');
// const path = require('path');
// const env = require('./environment');

// let transporter = nodemailer.createTransport(env.smtp);

// // relativePath = from where being the mail is sent
// let renderTemplate = (data, relativePath) => {
//     let mailHTML;
//     ejs.renderFile(
//         path.join(__dirname, '../views/mailers', relativePath),
//         data,
//         function (err, template) {
//             // console.log('path: ', path.join(__dirname, '../views/mailers', relativePath));
//             if(err){console.log('Error in rendering template', err);return;}

//             mailHTML = template;
//         }
//     );

//     return mailHTML;
// }

// module.exports = {
//     transporter: transporter,
//     renderTemplate: renderTemplate
// }