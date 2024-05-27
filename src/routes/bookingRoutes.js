const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authentication');
const { ErrorHandler } = require('../middleware/ErrorHandler');
const { createBooking, getBookingById, updateBooking, deleteBooking, getBookings } = require('../controller/bookingController');

// Booking Routes
router.get('/', async (req, res, next) => {
    try {
        const { userId } = req.query;
        const bookings = await getBookings(userId);
        if (!bookings) {
            res.status(400).json(bookings);
        } else {
            res.status(200).json(bookings);
        }
    } catch (error) {
        next(error);
    }
}, ErrorHandler);

router.post('/', authenticateToken, async (req, res, next) => {
    try {
        // grab fields for the new booking
        const { userId, propertyId, checkinDate, checkoutDate, numberOfGuests, totalPrice, bookingStatus } = req.body;

        if (!userId || !propertyId || !checkinDate || !checkoutDate || !numberOfGuests || !totalPrice || !bookingStatus) {
            return res.status(400).json("All fields are required.");
        }

        const newBooking = await createBooking(
            userId,
            propertyId,
            checkinDate,
            checkoutDate,
            numberOfGuests,
            totalPrice,
            bookingStatus
        );

        res.status(201).json({ message: 'Booking created successfully', booking: newBooking });

    } catch (error) {
        next(error);
    }
}, ErrorHandler);

router.get('/:id', async (req, res, next) => {
    try {
        // grab the booking id 
        const bookingId = req.params.id;

        const booking = await getBookingById(
            bookingId
        );

        if (!booking) {
            res.status(404).json("Booking not found");
        } else {
            res.status(200).json(booking);
        }

    } catch (error) {
        next(error);
    }
}, ErrorHandler);

router.put('/:id', authenticateToken, async (req, res, next) => {
    try {
        // grab the booking id 
        const bookingId = req.params.id;

        // retrieve booking details to update
        const { checkinDate, checkoutDate, numberOfGuests, totalPrice, bookingStatus } = req.body;

        const booking = await getBookingById(
            bookingId
        );

        if (!booking) {
            return res.status(404).json("Booking not found");
        }

        const updatedBooking = await updateBooking(
            bookingId,
            checkinDate,
            checkoutDate,
            numberOfGuests,
            totalPrice,
            bookingStatus
        );

        if (!updatedBooking) {
            res.status(400).json("Booking not updated.");
        } else {
            res.status(200).json({ message: 'Booking updated successfully', booking: updatedBooking });
        }

    } catch (error) {
        next(error);
    }
}, ErrorHandler);

router.delete('/:id', authenticateToken, async (req, res, next) => {
    try {
        // grab the booking id 
        const bookingId = req.params.id;

        // retrieve booking details to update
        const { checkinDate, checkoutDate, numberOfGuests, totalPrice, bookingStatus } = req.body;

        const booking = await getBookingById(
            bookingId
        );

        if (!booking) {
            return res.status(404).json("Booking not found");
        }

        const deletedBooking = await deleteBooking(
            bookingId
        );

        if (!deletedBooking) {
            res.status(400).json("Booking not deleted.");
        } else {
            res.status(200).json({ message: 'Booking deleted successfully' });
        }

    } catch (error) {
        next(error);
    }
}, ErrorHandler);

module.exports = router 