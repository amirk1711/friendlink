const User = require('../models/user');

module.exports.home = function(req, res){
    res.render('home', {
        title: 'friendlink',
    });
}