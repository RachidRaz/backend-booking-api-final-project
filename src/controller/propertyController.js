const prisma = require("../prisma");

const getProperties = async (req, res, next) => {
    try {

        const conditions = {};

        // grab the optional params from the url, defaults to no conditions if none are provided
        // the API has specific query requirements, but a good alternative for comprehensive filtering would be to have ranges for price and an array to include multiple amenities and locations
        req.query.location ? conditions.location = req.query.location : null;
        req.query.pricePerNight ? conditions.pricePerNight = req.query.pricePerNight : null;
        req.query.amenities ? conditions.amenities = req.query.amenities : null;

        const properties = await prisma.property.findMany({
            where: conditions
        });

        res.status(200).json({ properties });
    } catch (error) {
        next(error);
    }
};

const createProperty = async (req, res, next) => {


    try {
        // grab the property details and create a new property
        const { title, description, location, pricePerNight, bedroomCount, bathRoomCount, maxGuestCount, hostId, rating, amenityId } = req.body;

        const newProperty = await prisma.property.create({
            data: {
                title,
                description,
                location,
                pricePerNight,
                bedroomCount,
                bathRoomCount,
                maxGuestCount,
                hostId,
                rating,
                amenityId
            }
        });

        res.status(201).json({ message: 'Property created successfully', property: newProperty });
    } catch (error) {
        next(error);
    }
};

const getPropertyById = async (req, res, next) => {


    try {

        // retrieve property by id
        const propertyId = req.params.id;

        const property = await prisma.property.findUnique({
            where: {
                id: propertyId,
            },
        });

        if (!property) {
            return next({ message: 'Property not found' });
        }

        res.status(200).json({ property });
    } catch (error) {
        next(error);
    }
};

const updateProperty = async (req, res, next) => {

    // fetch the property id and its latest details
    const propertyId = req.params.id;
    const { title, description, location, pricePerNight, bedroomCount, bathroomCount, maxGuestCount, hostId, rating, amenityId } = req.body;

    try {
        // retrieve the current property details and validate that the property exists    
        const existingProperty = await prisma.property.findUnique({ where: { id: propertyId } });

        if (!existingProperty) {
            return next({ message: 'Property not found' });
        }

        // update w/ the latest details or retain the existing property details
        const updatedProperty = await prisma.property.update({
            where: {
                id: propertyId
            },
            data: {
                title: title || existingProperty.title,
                description: description || existingProperty.description,
                location: location || existingProperty.location,
                pricePerNight: pricePerNight || existingProperty.pricePerNight,
                bedroomCount: bedroomCount || existingProperty.bedroomCount,
                bathroomCount: bathroomCount || existingProperty.bathroomCount,
                maxGuestCount: maxGuestCount || existingProperty.maxGuestCount,
                hostId: hostId || existingProperty.hostId,
                rating: rating || existingProperty.rating,
                amenityId: amenityId || existingProperty.amenityId
            }
        });

        res.status(200).json({ message: 'Property updated successfully', property: updatedProperty });
    } catch (error) {
        next(error);
    }
};

const deleteProperty = async (req, res, next) => {


    try {
        // fetch the property id and property details
        const propertyId = req.params.id;

        const existingProperty = await prisma.property.findUnique({
            where: {
                id: propertyId
            }
        });

        if (!existingProperty) {
            return next({ message: 'Property not found' });
        }

        // delete the property from the property table
        await prisma.property.delete({ where: { id: propertyId } });

        res.status(200).json({ message: 'Property deleted successfully' });

    } catch (error) {
        next(error);
    }
};

module.exports = { createProperty, getPropertyById, updateProperty, deleteProperty, getProperties };
