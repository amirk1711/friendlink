const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

// dir where the log will be stored
const logDirectory = path.join(__dirname, '../production_logs');
// if logDirectory doesnt exists, it will be created
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: logDirectory
});

const development = {
    name: 'development',
    asset_path: '/assets',
    session_cookie_key: 'blahsomething',
    db: 'friendlink_development',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'friendlinkhelp',
            pass: 'Amir_1711',
        }
    },
    google_client_id: "500756648360-jccbaaqcmdge2vasnt78p9ea5l7vd619.apps.googleusercontent.com",
    google_client_secret: "mloXX6PO9WgINXqRovnT2OXc",
    google_callback_url: 'http://localhost:8000/users/auth/google/callback',
    jwt_secret: 'friendlink',
    morgan: {
        mode:'dev',
        options: {stream: accessLogStream}
    }
}

const production = {
    name: process.env.FRIENDLINK_ENVIRONMENT,
    asset_path: process.env.FRIENDLINK_ASSET_PATH,
    session_cookie_key: process.env.FRIENDLINK_SESSION_COOKIE_KEY,
    db: process.env.FRIENDLINK_DB,
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.FRIENDLINK_GMAIL_USERNAME,
            pass: process.env.FRIENDLINK_GMAIL_PASSWORD,
        }
    },
    google_client_id: process.env.FRIENDLINK_GOOGLE_CLIENT_ID,
    google_client_secret: process.env.FRIENDLINK_GOOGLE_CLIENT_SECRET,
    google_callback_url: process.env.FRIENDLINK_GOOGLE_CALLBACK_URL,
    jwt_secret: process.env.FRIENDLINK_JWT_SECRET,
    morgan: {
        mode:'combined',
        options: {stream: accessLogStream}
    }
}

module.exports = eval(process.env.FRIENDLINK_ENVIRONMENT) == undefined ? development : eval(process.env.FRIENDLINK_ENVIRONMENT); 