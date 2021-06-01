const kue = require('kue');
const queue = kue.createQueue();
module.exports = queue;

// after kue setup create a worker for this