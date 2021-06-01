const express = require('express');
const router = express.Router();

const accountsController = require('../controllers/accounts_controller');

router.get('/forgot-password', accountsController.forgotPassword);
router.post('/confirm-email', accountsController.confirmEmail);

module.exports = router;