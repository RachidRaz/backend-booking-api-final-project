const prisma = require("../prisma");

const getBookings = async (req, res, next) => {
    try {
        const conditions = {};

        // grab the optional params from the url, defaults to no conditions
        req.query.userId ? conditions.userId = req.query.userId : null;

        // fetch all bookings w/ optional filter
        const bookings = await prisma.booking.findMany({
            where: conditions
        });

        res.status(200).json({ bookings })
    } catch (error) {
        next(error);
    }
};

const createBooking = async (req, res, next) => {

    try {
        // grab fields for the new booking
        const { userId, propertyId, checkinDate, checkoutDate, numberOfGuests, totalPrice, bookingStatus } = req.body;

        // create the new booking
        const newBooking = await prisma.booking.create({
            data: {
                userId,
                propertyId,
                checkinDate,
                checkoutDate,
                numberOfGuests,
                totalPrice,
                bookingStatus
            }
        });

        res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
    } catch (error) {
        next(error);
    }
};

const getBookingById = async (req, res, next) => {

    try {
        // grab the booking id 
        const bookingId = req.params.id;

        // find the booking by id, also return the property relation/ object
        const booking = await prisma.booking.findUnique({
            where: {
                id: bookingId,
            },
            include: {
                // user: true, //this is used for testing, object contains password best practice to return only user fields required for the API
                property: true
            }
        });

        if (!booking) {
            return next({ message: 'Booking not found' });
        }

        res.status(200).json({ booking });
    } catch (error) {
        next(error);
    }
};

const updateBooking = async (req, res, next) => {

    try {
        // retrieve booking id to update
        const bookingId = req.params.id;

        // retrieve booking details to update
        const { checkinDate, checkoutDate, numberOfGuests, totalPrice, bookingStatus } = req.body;

        // check if booking exists
        const existingBooking = await prisma.booking.findUnique({
            where: {
                id: bookingId
            }
        });

        if (!existingBooking) {
            return next({ message: 'Booking not found' });
        }

        // update the booking w/ new details or keep existing booking fields
        const updatedBooking = await prisma.booking.update({
            where: {
                id: bookingId
            },
            data: {
                checkinDate: checkinDate || existingBooking.checkinDate,
                checkoutDate: checkoutDate || existingBooking.checkoutDate,
                numberOfGuests: numberOfGuests || existingBooking.numberOfGuests,
                totalPrice: totalPrice || existingBooking.totalPrice,
                bookingStatus: bookingStatus || existingBooking.bookingStatus
            }
        });

        res.status(200).json({ message: 'Booking updated successfully', booking: updatedBooking });

    } catch (error) {
        next(error);
    }
};

const deleteBooking = async (req, res, next) => {

    try {
        // retrieve booking id
        const bookingId = req.params.id;

        // grab and validate booking from id
        const existingBooking = await prisma.booking.findUnique({
            where: {
                id: bookingId
            }
        });

        if (!existingBooking) {
            return next({ message: 'Booking not found' });
        }

        // remove the booking from the bookings table
        await prisma.booking.delete({ where: { id: bookingId } });

        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = { createBooking, getBookings, getBookingById, updateBooking, deleteBooking };
