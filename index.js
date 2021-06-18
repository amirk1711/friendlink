const express = require('express');
const env = require('./config/environment');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const app = express();
require('./config/view-helper')(app);
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');

const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const { pass } = require('./config/mongoose');
const MongoStore = require('connect-mongo');
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');

const path = require('path');
const { Server } = require('http');

// use middleware to compile scss file into css file
// src: from where to pick scss file
// dest: where css file will be placed after compiling scss
// Note: you must place sass-middleware before `express.static`
// prefix - (String) It will tell the sass middleware that 
// any request file will always be prefixed with <prefix> and this prefix should be ignored.

// run sass middleware only in development mode
if(env.name == 'development'){
    app.use(sassMiddleware({
        src: path.join(__dirname, env.asset_path, 'scss'),
        dest: path.join(__dirname, env.asset_path, 'css'),
        debug: false,
        outputStyle: 'extended',
        prefix: '/css' // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
    }));
}


// express.urlencoded will extract the data from the form and add them into req.body
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(env.asset_path));

// make the uploads path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));

//to create log for console statments
app.use(logger(env.morgan.mode , env.morgan.options));

// tell the app to use express layouts
app.use(expressLayouts);

// extract the styles and scripts from sub pages into the layouts
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// setup the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// add a middleware which encrypt the session cookie
app.use(session({
    name: 'friendlink',
    // change the secret before deployment in producction mode
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 1000)
    },
    // mongo store is used to store session cookie in the db
    store: MongoStore.create(
        {
            // mongooseConnection: db,
            mongoUrl: 'mongodb://localhost/friendlink-development',
            autoRemove: 'disabled'
        },
        function(err){
            if(err){
                console.log(`Error in mongo store: ${err}`);
            }else{
                console.log('connect-mongo setup ok');
            }
        }
    )
}));

// we need to tell the app to use passport
app.use(passport.initialize());
app.use(passport.session());

// set authenticated user in locals
app.use(passport.setAuthenticatedUser);

// all requests will have a req.flash() function 
// that can be used for flash messages.
app.use(flash());
// use this middleware to put flash into res.locals
// so that it will be accessible in the ejs templates
app.use(customMware.setFlash);

// handle the routes
// writing index is not neccessary
app.use('/', require('./routes/index'));

// make server listen
app.listen(port, function(err){
    if(err){
        console.log(`Error in running server: ${err}`);
        return;
    }
    console.log(`Server is running on port: ${port}`);
});