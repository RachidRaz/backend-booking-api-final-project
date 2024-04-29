const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authentication');
const { ErrorHandler } = require('../middleware/ErrorHandler');
const { createBooking, getBookingById, updateBooking, deleteBooking, getBookings } = require('../controller/bookingController');

// Booking Routes
router.get('/', getBookings, ErrorHandler);
router.post('/', authenticateToken, createBooking, ErrorHandler);
router.get('/:id', getBookingById, ErrorHandler);
router.put('/:id', authenticateToken, updateBooking, ErrorHandler);
router.delete('/:id', authenticateToken, deleteBooking, ErrorHandler);

module.exports = router