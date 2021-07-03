const multer = require('multer');
const path = require('path');

// set storage
let storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, "..", '/uploads/users/posts'));
	},
	filename: function (req, file, cb) {
		// so our files in uploads folder will be stored as 'avatar-date'

        // filename = image.jpg, ext = jpg
        let ext = file.originalname.substr(file.originalname.lastIndexOf('.'));
        console.log('extension', ext);
		cb(null, file.fieldname + "-" + Date.now());
	},
});

module.exports = store = multer({storage: storage});