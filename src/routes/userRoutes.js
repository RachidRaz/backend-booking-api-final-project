const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authentication');
const { ErrorHandler } = require('../middleware/ErrorHandler');
const { UserRegister, getUserById, updateUser, deleteUser, getUsers } = require('../controller/userController');

//User Routes
router.get('/', getUsers, ErrorHandler) //get users
router.post('/', UserRegister, ErrorHandler); // register user
router.get('/:id', getUserById, ErrorHandler); //retrieve specific user
router.put('/:id', authenticateToken, updateUser, ErrorHandler); //update specific user
router.delete('/:id', authenticateToken, deleteUser, ErrorHandler); //delete specific user

module.exports = router