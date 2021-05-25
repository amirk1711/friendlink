const express = require('express');
const app = express();
const port = 8000;

// setup the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// handle the routes
app.use('/', require('./routes'));


// make server listen
app.listen(port, function(err){
    if(err){
        console.log(`Error in running server: ${err}`);
        return;
    }

    console.log(`Server is running on port: ${port}`);
});