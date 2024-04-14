const prisma = require("../prisma");

const createBooking = async (req, res,next) => {
    const { userId, propertyId, checkinDate, checkoutDate, numberOfGuests, totalPrice, bookingStatus } = req.body;

    try {
        // Create the new booking
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
        console.error('Error creating booking:', error);
       return next({ error: 'Internal Server Error' });
    }
};

const getAllBookings = async (req, res,next) => {
    try {
        const bookings = await prisma.booking.findMany();
        res.status(200).json({ bookings });
    } catch (error) {
        console.error('Error retrieving bookings:', error);
       return next({ error: 'Internal Server Error' });
    }
};

const getBookingById = async (req, res,next) => {
    const bookingId = req.params.id;

    try {
        const booking = await prisma.booking.findUnique({
            where: {
                id: bookingId,
            },
            include: {
                user: true,
                property: true
            }
        });

        if (!booking) {
            return next({ message: 'Booking not found' });
        }

        res.status(200).json({ booking });
    } catch (error) {
        console.error('Error retrieving booking:', error);
       return next({ error: 'Internal Server Error' });
    }
};

const updateBooking = async (req, res,next) => {
    const bookingId = req.params.id;
    const { checkinDate, checkoutDate, numberOfGuests, totalPrice, bookingStatus } = req.body;

    try {
        const existingBooking = await prisma.booking.findUnique({ where: { id: bookingId } });
        if (!existingBooking) {
            return next({ message: 'Booking not found' });
        }

        const updatedBooking = await prisma.booking.update({
            where: { id: bookingId },
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
        console.error('Error updating booking:', error);
       return next({ error: 'Internal Server Error' });
    }
};

const deleteBooking = async (req, res,next) => {
    const bookingId = req.params.id;

    try {
        const existingBooking = await prisma.booking.findUnique({ where: { id: bookingId } });
        if (!existingBooking) {
            return next({ message: 'Booking not found' });
        }

        await prisma.booking.delete({ where: { id: bookingId } });

        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        console.error('Error deleting booking:', error);
       return next({ error: 'Internal Server Error' });
    }
};
const getAllBookingFilter = async (req, res,next) => {
    try {
        const { userId } = req.query;

        let bookingFilter = {};

        if (userId) {
            bookingFilter.userId = userId;
        }

        const bookings = await prisma.booking.findMany({
            where: bookingFilter
        });

        res.status(200).json({ bookings });
    } catch (error) {
        console.error('Error retrieving bookings:', error);
       return next({ error: 'Internal Server Error' });
    }
};
module.exports = { createBooking, getAllBookings, getBookingById, updateBooking, deleteBooking,getAllBookingFilter };
