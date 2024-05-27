const prisma = require("../prisma");


const getBookings = async (userId) => {

    const conditions = {};

    // grab the optional params from the url, defaults to no conditions
    conditions.userId = userId;

    // fetch all bookings w/ optional filter
    const bookings = await prisma.booking.findMany({
        where: conditions
    });

    return bookings;
};


const createBooking = async (userId,
    propertyId,
    checkinDate,
    checkoutDate,
    numberOfGuests,
    totalPrice,
    bookingStatus
) => {

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
    return newBooking;
};

const getBookingById = async (bookingId) => {

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

    return booking;
};

const updateBooking = async (bookingId,
    checkinDate,
    checkoutDate,
    numberOfGuests,
    totalPrice,
    bookingStatus
) => {

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

    return updatedBooking;
};

const deleteBooking = async (bookingId) => {

    // remove the booking from the bookings table
    const deletedBooking = await prisma.booking.delete({ where: { id: bookingId } });

    return deletedBooking;
};

module.exports = { createBooking, getBookings, getBookingById, updateBooking, deleteBooking };
