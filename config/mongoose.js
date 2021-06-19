const mongoose = require('mongoose');
const env = require('./environment');
const uri = process.env.MONGODB_URI;

mongoose.connect(uri || `mongodb://localhost/${env.db}`, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error connecting to MongoDB'));

db.once('open', function(){
    console.log('Connected to MongoDB');
});

module.exports = db;