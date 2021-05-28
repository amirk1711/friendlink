module.exports.setFlash = function(req, res, next){
    // find the flash from the req and
    // set in the res.locals
    res.locals.flash = {
        'success': req.flash('success'),
        'error': req.flash('error')
    };
    next();
}