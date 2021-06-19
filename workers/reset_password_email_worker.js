// const queue = require('../config/kue');

// const resetPasswordMailer = require('../mailers/reset_password_mailer');

// // every worker has a process function
// // it will tell the worker whenever a new task is added to queue
// // you need to run this code (inside process function)

// // this process function calls the mailer
// queue.process('resetPasswordEmails', function (job, done) {
//     console.log('reset password emails worker is processing a job', job.data);

//     resetPasswordMailer.passResetToken(job.data);
//     done();
// });