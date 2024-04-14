const express = require('express');
const { getAmenities, createAmenity, getAmenityById, updateAmenity, deleteAmenity } = require('../controller/amenityController');
const { getAllBookings, createBooking, getBookingById, updateBooking, deleteBooking, getAllBookingFilter } = require('../controller/bookingController');
const { createHost, getHostById, updateHost, deleteHost, getAllHosts, getHostByName } = require('../controller/hostController');
const { getAllProperties, createProperty, getPropertyById, updateProperty, deleteProperty, getFilteredProperties } = require('../controller/propertyController');
const { getAllReviews, createReview, getReviewById,updateReview,deleteReview } = require('../controller/reviewController');
const {authenticateToken}=require('../middleware/authentication')
const router = express.Router();
const { ErrorHandler } = require('../middleware/ErrorHandler');
const { UserRegister, UserLogin, getUserById, updateUser, deleteUser,getUsers, getUserByEmail } = require('../controller/userController')

//User Routes
router.get('/users',authenticateToken,getUsers,ErrorHandler)
router.post('/user/register', UserRegister,ErrorHandler);
router.post('/user/login', UserLogin,ErrorHandler);
router.get('/user/:id',authenticateToken, getUserById,ErrorHandler);
router.put('/user/:id',authenticateToken, updateUser,ErrorHandler);
router.delete('/user/:id',authenticateToken, deleteUser,ErrorHandler);
router.get('/users/filterByEmail',authenticateToken, getUserByEmail,ErrorHandler);


// Amenities Routes
router.get('/amenities',authenticateToken, getAmenities,ErrorHandler);
router.post('/amenity',authenticateToken, createAmenity,ErrorHandler);
router.get('/amenity/:id',authenticateToken, getAmenityById,ErrorHandler);
router.put('/amenity/:id',authenticateToken, updateAmenity,ErrorHandler);
router.delete('/amenity/:id',authenticateToken, deleteAmenity,ErrorHandler);

// Host Routes
router.post('/host',authenticateToken, createHost,ErrorHandler);
router.get('/host/:id',authenticateToken, getHostById,ErrorHandler);
router.put('/host/:id',authenticateToken, updateHost,ErrorHandler);
router.delete('/host/:id',authenticateToken, deleteHost,ErrorHandler);
router.get('/hosts',authenticateToken, getAllHosts,ErrorHandler);
router.get('/hosts/filterByName',authenticateToken, getHostByName,ErrorHandler);

// Property Routes
router.get('/properties',authenticateToken, getFilteredProperties,ErrorHandler);
router.get('/properties',authenticateToken, getAllProperties,ErrorHandler);
router.post('/property',authenticateToken, createProperty,ErrorHandler);
router.get('/property/:id',authenticateToken, getPropertyById,ErrorHandler);
router.put('/property/:id',authenticateToken, updateProperty,ErrorHandler);
router.delete('/property/:id',authenticateToken, deleteProperty,ErrorHandler);

// Booking Routesget
router.get('/bookings',authenticateToken, getAllBookingFilter,ErrorHandler);
router.get('/bookings',authenticateToken, getAllBookings,ErrorHandler);
router.post('/booking',authenticateToken, createBooking,ErrorHandler);
router.get('/booking/:id', authenticateToken,getBookingById,ErrorHandler);
router.put('/booking/:id', authenticateToken,updateBooking,ErrorHandler);
router.delete('/booking/:id',authenticateToken, deleteBooking,ErrorHandler);


//Review Routes
router.post('/reviews', authenticateToken,createReview,ErrorHandler);
router.get('/reviews',authenticateToken, getAllReviews,ErrorHandler);
router.get('/reviews/:id',authenticateToken, getReviewById,ErrorHandler);
router.put('/reviews/:id', authenticateToken,updateReview,ErrorHandler);
router.delete('/reviews/:id',authenticateToken, deleteReview,ErrorHandler);

module.exports = router