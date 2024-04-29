const express = require('express');
const router = express.Router();
const { ErrorHandler } = require('../middleware/ErrorHandler');
const { login } = require('../controller/loginController');

//Login Routes
router.post('/', login, ErrorHandler) //login users/host

module.exports = router