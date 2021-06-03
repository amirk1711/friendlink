const fs = require('fs');
const env = require('./environment');
const path = require('path');

// it will take express app as input and
// set assetPath in the locals of my express app
module.exports = (app) => {
    // filePath is original filename(e.g. header.css)
    // after hashing filename we have to link
    app.locals.assetPath = function(filePath){
        if(env.name == 'development'){
            // in development mode, no hashing is performed on any file
            return filePath; 
        }
        return '/' + JSON.parse(fs.readFileSync(path.join(__dirname , '../public/assets/rev-manifest.json')))[filePath];
    }
}