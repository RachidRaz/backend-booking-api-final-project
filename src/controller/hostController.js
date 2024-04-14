const prisma = require("../prisma");
const bcrypt = require('bcrypt');

const createHost = async (req, res,next) => {
    const { username, password, name, email, phoneNumber, profilePicture, aboutMe } = req.body;

    try {
        // Check if the host already exists
        const existingHost = await prisma.host.findFirst({
            where: {
                OR: [
                    { username },
                    { email }
                ]
            }
        });
        if (existingHost) {
            return res.status(400).json({ message: 'Host already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new host with hashed password
        const newHost = await prisma.host.create({
            data: {
                username,
                password: hashedPassword,
                name,
                email,
                phoneNumber,
                profilePicture,
                aboutMe
            }
        });

        res.status(201).json({ message: 'Host registered successfully', host: newHost });
    } catch (error) {
        console.error('Error registering host:', error);
       return next({ error: 'Internal Server Error' });
    }
};

const getHostById = async (req, res,next) => {
    const hostId = req.params.id;

    try {
        const host = await prisma.host.findUnique({
            where: {
                id: hostId,
            },
        });

        if (!host) {
            return next({ message: 'Host not found' });
        }

        res.status(200).json({ host });
    } catch (error) {
        console.error('Error retrieving host:', error);
       return next({ error: 'Internal Server Error' });
    }
};

const updateHost = async (req, res,next) => {
    const hostId = req.params.id;
    const { username, password, name, email, phoneNumber, profilePicture, aboutMe } = req.body;

    try {
        const existingHost = await prisma.host.findUnique({ where: { id: hostId } });
        if (!existingHost) {
            return next({ message: 'Host not found' });
        }

        let hashedPassword;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        const updatedHost = await prisma.host.update({
            where: { id: hostId },
            data: {
                username: username || existingHost.username,
                password: hashedPassword || existingHost.password,
                name: name || existingHost.name,
                email: email || existingHost.email,
                phoneNumber: phoneNumber || existingHost.phoneNumber,
                profilePicture: profilePicture || existingHost.profilePicture,
                aboutMe: aboutMe || existingHost.aboutMe
            }
        });

        res.status(200).json({ message: 'Host updated successfully', host: updatedHost });
    } catch (error) {
        console.error('Error updating host:', error);
       return next({ error: 'Internal Server Error' });
    }
};

const deleteHost = async (req, res,next) => {
    const hostId = req.params.id;

    try {
        const existingHost = await prisma.host.findUnique({ where: { id: hostId } });
        if (!existingHost) {
            return next({ message: 'Host not found' });
        }

        await prisma.host.delete({ where: { id: hostId } });

        res.status(200).json({ message: 'Host deleted successfully' });
    } catch (error) {
        console.error('Error deleting host:', error);
       return next({ error: 'Internal Server Error' });
    }
};
const getAllHosts = async (req, res,next) => {
    try {
        const hosts = await prisma.host.findMany();
        res.status(200).json({ hosts });
    } catch (error) {
        console.error('Error retrieving hosts:', error);
       return next({ error: 'Internal Server Error' });
    }
};
const getHostByName = async (req, res,next) => {
    const { name } = req.query;
    try {
        const hosts = await prisma.host.findMany({
            where: {
                name: {
                    equals: name
                }
            }
        });

      return  res.status(200).json({ hosts });
    } catch (error) {
        console.error('Error retrieving hosts by name:', error);
    return next({message:'Internal Server Error'})
        //   return return next({ error: 'Internal Server Error' });
    }
};
module.exports = { createHost,getAllHosts, getHostById, updateHost, deleteHost,getHostByName };
