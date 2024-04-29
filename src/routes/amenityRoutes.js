const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authentication');
const { ErrorHandler } = require('../middleware/ErrorHandler');
const { getAmenities, createAmenity, getAmenityById, updateAmenity, deleteAmenity } = require('../controller/amenityController');

// Amenities Routes
router.get('/', getAmenities, ErrorHandler);
router.post('/', authenticateToken, createAmenity, ErrorHandler);
router.get('/:id', getAmenityById, ErrorHandler);
router.put('/:id', authenticateToken, updateAmenity, ErrorHandler);
router.delete('/:id', authenticateToken, deleteAmenity, ErrorHandler);

module.exports = router