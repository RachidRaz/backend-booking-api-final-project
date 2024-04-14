const prisma = require("../prisma");

const createProperty = async (req, res,next) => {
    const { title, description, location, pricePerNight, bedroomCount, bathroomCount, maxGuestCount, hostId, rating, amenityId } = req.body;

    try {
        const newProperty = await prisma.property.create({
            data: {
                title,
                description,
                location,
                pricePerNight,
                bedroomCount,
                bathroomCount,
                maxGuestCount,
                hostId,
                rating,
                amenityId
            }
        });

        res.status(201).json({ message: 'Property created successfully', property: newProperty });
    } catch (error) {
        console.error('Error creating property:', error);
       return next({ error: 'Internal Server Error' });
    }
};

const getPropertyById = async (req, res,next) => {
    const propertyId = req.params.id;

    try {
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
        console.error('Error retrieving property:', error);
       return next({ error: 'Internal Server Error' });
    }
};

const updateProperty = async (req, res,next) => {
    const propertyId = req.params.id;
    const { title, description, location, pricePerNight, bedroomCount, bathroomCount, maxGuestCount, hostId, rating, amenityId } = req.body;

    try {
        const existingProperty = await prisma.property.findUnique({ where: { id: propertyId } });
        if (!existingProperty) {
            return next({ message: 'Property not found' });
        }

        const updatedProperty = await prisma.property.update({
            where: { id: propertyId },
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
        console.error('Error updating property:', error);
       return next({ error: 'Internal Server Error' });
    }
};

const deleteProperty = async (req, res,next) => {
    const propertyId = req.params.id;

    try {
        const existingProperty = await prisma.property.findUnique({ where: { id: propertyId } });
        if (!existingProperty) {
            return next({ message: 'Property not found' });
        }

        await prisma.property.delete({ where: { id: propertyId } });

        res.status(200).json({ message: 'Property deleted successfully' });
    } catch (error) {
        console.error('Error deleting property:', error);
       return next({ error: 'Internal Server Error' });
    }
};

const getAllProperties = async (req, res,next) => {
    try {
        const properties = await prisma.property.findMany();
        res.status(200).json({ properties });
    } catch (error) {
        console.error('Error retrieving properties:', error);
       return next({ error: 'Internal Server Error' });
    }
};
const getFilteredProperties = async (req, res,next) => {
    try {
        const { location, pricePerNight, amenities: amenityFilters } = req.query;

        let propertyFilter = {};

        if (location) {
            propertyFilter.location = location;
        }

        if (pricePerNight) {
            propertyFilter.pricePerNight = parseFloat(pricePerNight);
        }

        const properties = await prisma.property.findMany({
            where: propertyFilter,
        });

        let propertyIds = properties.map(property => property.id);

        let amenities = [];

        if (amenityFilters) {
            const amenityArray = Array.isArray(amenityFilters) ? amenityFilters : [amenityFilters];
            amenities = await prisma.amenity.findMany({
                where: {
                    name: { in: amenityArray }
                }
            });
        }

        // Map amenities to properties
        const propertiesWithAmenities = properties.map(property => {
            const propertyAmenities = amenities.filter(amenity => amenity.properties.some(prop => prop.id === property.id));
            return { ...property, amenities: propertyAmenities };
        });

        res.status(200).json({ properties: propertiesWithAmenities });
    } catch (error) {
        console.error('Error retrieving properties:', error);
       return next({ error: 'Internal Server Error' });
    }
};




module.exports = { createProperty, getPropertyById, updateProperty, deleteProperty, getAllProperties, getFilteredProperties };
