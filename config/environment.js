const development = {
    name: 'development',
    asset_path: 'assets',
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
}

const production = {
    name: 'production'
}

module.exports = development;