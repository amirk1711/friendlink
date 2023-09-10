const development = {
    name: "development",
    db: "friendlink_development",
	db_uri:"mongodb://localhost:27017",
    jwt_secret: "randomrandomrandomrandomrandomA1",
	port: 8000,
};

const production = {
    name: process.env.FRIENDLINK_ENVIRONMENT,
    db: process.env.FRIENDLINK_DB,
	db_uri: process.env.MONGODB_URI,
	jwt_secret: process.env.FRIENDLINK_JWT_SECRET,
	port: process.env.PORT,
};

module.exports = eval(process.env.FRIENDLINK_ENVIRONMENT);
