const express = require('express');
const router = express.Router();
const passport = require('passport');

const likesApi = require('../../../controllers/api/v1/likes_api');

router.post('/toggle', passport.checkAuthentication, likesApi.toggleLike); 
router.get('/fetch', passport.checkAuthentication, likesApi.fetchLikes);

module.exports = router;