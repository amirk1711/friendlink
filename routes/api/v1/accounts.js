const express = require("express");
const router = express.Router();
const passport = require("passport");

const accountsApi = require("../../../controllers/api/v1/accounts_api");

router.post('/confirm-email', accountsApi.confirmEmail);
router.get('/reset', accountsApi.reset);
router.post('/reset-password', accountsApi.resetPassword);

module.exports = router;