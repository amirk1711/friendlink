const Agenda = require('agenda');
const env = require('./environment');
const connectionString = `mongodb://localhost/${env.db}`;
const resetPasswordMailer = require('../mailers/reset_password_mailer');


const agenda = new Agenda({
    db: {address: connectionString, collection: 'scheduleJobCollection', options: {useUnifiedTopology: true}},
    processEvery: '30 seconds',
    // processEvery is the interval at which agenda checks if there are tasks to be run.
});

// concurrency = number of jobs that can be running at any given moment
let job = agenda.define('forgot-password-email', {priority: 'high', concurrency: 10}, (job, done) => {
    const { myToken } = job.attrs.data;
    resetPasswordMailer.passResetToken(myToken);
    done();
});


module.exports = agenda;