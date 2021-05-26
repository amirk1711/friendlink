const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');

// express.urlencoded will extract the data from the form and add them into req.body
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./assets'));

// tell the app to use express layouts
app.use(expressLayouts);
// extract the styles and scripts from sub pages into the layouts
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


// setup the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// handle the routes
// writing index is not neccesary
app.use('/', require('./routes/index'));


// make server listen
app.listen(port, function(err){
    if(err){
        console.log(`Error in running server: ${err}`);
        return;
    }

    console.log(`Server is running on port: ${port}`);
});