const mongoose = require("mongoose");
const env = require("./environment");
const uri = env.db_uri;

mongoose.connect(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
    useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error connecting to MongoDB"));
db.once("open", function () {
	if(env.name === "development") console.log("Connected to MongoDB");
});

module.exports = db;
