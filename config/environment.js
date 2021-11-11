const development = {
	name: "development",
	session_cookie_key: "blahsomething",
	db: "friendlink_development",
	smtp: {
		service: "gmail",
		host: "smtp.gmail.com",
		port: 587,
		secure: false,
		auth: {
			user: "friendlinkhelp",
			pass: "password",
		},
		tls: {
			rejectUnauthorized: false,
			ciphers: "SSLv3",
		},
	},
};

const production = {
	name: process.env.FRIENDLINK_ENVIRONMENT,
	session_cookie_key: process.env.FRIENDLINK_SESSION_COOKIE_KEY,
	db: process.env.FRIENDLINK_DB,
	smtp: {
		service: "gmail",
		host: "smtp.gmail.com",
		port: 587,
		secure: false,
		auth: {
			user: process.env.FRIENDLINK_GMAIL_USERNAME,
			pass: process.env.FRIENDLINK_GMAIL_PASSWORD,
		},
		tls: {
			rejectUnauthorized: false,
			ciphers: "SSLv3",
		},
	},
	google_client_id: process.env.FRIENDLINK_GOOGLE_CLIENT_ID,
	google_client_secret: process.env.FRIENDLINK_GOOGLE_CLIENT_SECRET,
	google_callback_url: process.env.FRIENDLINK_GOOGLE_CALLBACK_URL,
	jwt_secret: process.env.FRIENDLINK_JWT_SECRET,
};

module.exports =
	eval(process.env.FRIENDLINK_ENVIRONMENT) == undefined
		? development
		: eval(process.env.FRIENDLINK_ENVIRONMENT);

// run in development mode for debugging
// module.exports = development;
