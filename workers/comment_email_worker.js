// const queue = require('../config/kue');

// const commentsMailer = require('../mailers/comments_mailer');

// // every worker has a process function
// // it will tell the worker whenever a new task is added to queue
// // you need to run this code (inside process function)

// // this process function calls the mailer
// queue.process('emails', function (job, done) {
//     // 'emails' is name of queue or type of queue
//     console.log('emails worker is processing a job: ', job.data);

//     commentsMailer.newComment(job.data);
//     done();
// });