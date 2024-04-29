const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authentication');
const { ErrorHandler } = require('../middleware/ErrorHandler');
const { createHost, getHostById, updateHost, deleteHost, getHosts } = require('../controller/hostController');


// Host Routes
router.get('/', getHosts, ErrorHandler);
router.post('/', createHost, ErrorHandler);
router.get('/:id', getHostById, ErrorHandler);
router.put('/:id', authenticateToken, updateHost, ErrorHandler);
router.delete('/:id', authenticateToken, deleteHost, ErrorHandler);

module.exports = router