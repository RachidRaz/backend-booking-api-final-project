const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authentication');
const { ErrorHandler } = require('../middleware/ErrorHandler');
const { getProperties, createProperty, getPropertyById, updateProperty, deleteProperty } = require('../controller/propertyController');

// Property Routes
router.get('/', getProperties, ErrorHandler);
router.post('/', authenticateToken, createProperty, ErrorHandler);
router.get('/:id', getPropertyById, ErrorHandler);
router.put('/:id', authenticateToken, updateProperty, ErrorHandler);
router.delete('/:id', authenticateToken, deleteProperty, ErrorHandler);

module.exports = router