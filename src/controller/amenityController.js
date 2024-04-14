const prisma = require("../prisma");

const createAmenity = async (req, res,next) => {
    const { name } = req.body;

    try {
        const existingAmenity = await prisma.amenity.findFirst({ where: { name } });
        if (existingAmenity) {
            return res.status(400).json({ message: 'Amenity already exists' });
        }

        const newAmenity = await prisma.amenity.create({
            data: { name }
        });

        res.status(201).json({ message: 'Amenity created successfully', amenity: newAmenity });
    } catch (error) {
        console.error('Error creating amenity:', error);
       return next({ error: 'Internal Server Error' });
    }
};

const getAmenityById = async (req, res,next) => {
    const amenityId = req.params.id;

    try {
        const amenity = await prisma.amenity.findUnique({ where: { id: amenityId } });
        if (!amenity) {
            return next({ message: 'Amenity not found' });
        }

        res.status(200).json({ amenity });
    } catch (error) {
        console.error('Error retrieving amenity:', error);
       return next({ error: 'Internal Server Error' });
    }
};

const updateAmenity = async (req, res,next) => {
    const amenityId = req.params.id;
    const { name } = req.body;

    try {
        const existingAmenity = await prisma.amenity.findUnique({ where: { id: amenityId } });
        if (!existingAmenity) {
            return next({ message: 'Amenity not found' });
        }

        const updatedAmenity = await prisma.amenity.update({
            where: { id: amenityId },
            data: { name }
        });

        res.status(200).json({ message: 'Amenity updated successfully', amenity: updatedAmenity });
    } catch (error) {
        console.error('Error updating amenity:', error);
       return next({ error: 'Internal Server Error' });
    }
};

const deleteAmenity = async (req, res,next) => {
    const amenityId = req.params.id;

    try {
        const existingAmenity = await prisma.amenity.findUnique({ where: { id: amenityId } });
        if (!existingAmenity) {
            return next({ message: 'Amenity not found' });
        }

        await prisma.amenity.delete({ where: { id: amenityId } });

        res.status(200).json({ message: 'Amenity deleted successfully' });
    } catch (error) {
        console.error('Error deleting amenity:', error);
       return next({ error: 'Internal Server Error' });
    }
};

const getAmenities = async (req, res,next) => {
    try {
        const amenities = await prisma.amenity.findMany();
        if (!amenities) {
            return next({ message: "No amenities found" });
        }
        res.status(200).json({ amenities });
    } catch (error) {
        console.error('Error retrieving amenities:', error);
       return next({ error: 'Internal Server Error' });
    }
};

module.exports = { createAmenity, getAmenityById, updateAmenity, deleteAmenity, getAmenities };
