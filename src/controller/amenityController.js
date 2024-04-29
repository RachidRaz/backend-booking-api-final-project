const prisma = require("../prisma");

const getAmenities = async (req, res, next) => {
    try {
        // retrieve all amenities
        const amenities = await prisma.amenity.findMany();

        if (!amenities) {
            return next({ message: "No amenities found" });
        }

        res.status(200).json({ amenities });

    } catch (error) {
        next(error);
    }
};

const createAmenity = async (req, res, next) => {

    try {
        // grab the amenity and validate if it pre-exists
        const { name } = req.body;

        const existingAmenity = await prisma.amenity.findFirst({
            where: {
                name
            }
        });

        if (existingAmenity) {
            return res.status(400).json({ message: 'Amenity already exists' });
        }

        // create new amenity
        const newAmenity = await prisma.amenity.create({
            data: {
                name
            }
        });

        res.status(201).json({ message: 'Amenity created successfully', amenity: newAmenity });

    } catch (error) {
        next(error);
    }
};

const getAmenityById = async (req, res, next) => {


    try {
        // using  the amenity id and retrieve the amenity details (name)
        const amenityId = req.params.id;

        const amenity = await prisma.amenity.findUnique({
            where: {
                id: amenityId
            }
        });

        if (!amenity) {
            return next({ message: 'Amenity not found' });
        }

        res.status(200).json({ amenity });

    } catch (error) {
        next(error);
    }
};

const updateAmenity = async (req, res, next) => {

    try {

        // validate if the amenity name is already used, and if the amenity id provided exists
        const amenityId = req.params.id;
        const { name } = req.body;

        const existingAmenityName = await prisma.amenity.findFirst({
            where: {
                name
            }
        });

        if (existingAmenityName) {
            return res.status(400).json({ message: 'Amenity name already exists' });
        }

        const existingAmenity = await prisma.amenity.findUnique({ where: { id: amenityId } });
        if (!existingAmenity) {
            return next({ message: 'Amenity not found' });
        }

        // update the amenity with the new name
        const updatedAmenity = await prisma.amenity.update({
            where: {
                id: amenityId
            },
            data: {
                name
            }
        });

        res.status(200).json({ message: 'Amenity updated successfully', amenity: updatedAmenity });
    } catch (error) {
        next(error);
    }
};

const deleteAmenity = async (req, res, next) => {

    try {
        // retrieve the amenity id and validate if it exists
        const amenityId = req.params.id;

        const existingAmenity = await prisma.amenity.findUnique({ where: { id: amenityId } });

        if (!existingAmenity) {
            return next({ message: 'Amenity not found' });
        }

        // delete any related records in the PropertyAmenity table
        await prisma.propertyAmenity.deleteMany({
            where: {
                amenityId: amenityId
            }
        });

        // delete the amenity from the amenity table
        await prisma.amenity.delete({
            where: {
                id: amenityId
            }
        });

        res.status(200).json({ message: 'Amenity deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = { createAmenity, getAmenityById, updateAmenity, deleteAmenity, getAmenities };
