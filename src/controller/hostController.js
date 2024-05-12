const prisma = require("../prisma");
const bcrypt = require('bcrypt');

const getHosts = async (req, res, next) => {

    try {
        let conditions = {};

        // grab the optional name param from the url (returns matches even w/ parts of the name)
        // defaults to grabbing all hosts
        req.query.name ? conditions.name = {
            contains: req.query.name
        } : null;

        // fetch all bookings w/ optional filter
        const hosts = await prisma.host.findMany({
            where: conditions
        });

        if (!hosts) {
            return res.status(404).json("Hosts not found");
        }

        res.status(200).json(hosts);
    } catch (error) {
        next(error);
    }
};

const createHost = async (req, res, next) => {
    const { username, password, name, email, phoneNumber, profilePicture, aboutMe } = req.body;

    if (!username || !password || !name || !email || !phoneNumber || !profilePicture || !aboutMe) {
        return res.status(400).json("All fields are required.");
    }

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

        // Check if the user already exists since the login is both for users as hosts
        // alternatively we could combine users and hosts into one table (users table), each user will have a login account (logins table) w/ an username/password
        // this way hosts can be a guests too, making a booking to a property - unless the platform is designed to function differently with two dashboards for each hosts and users/guests
        // but even then it would make sense to have them operate the same and have a dashboard/user type that displays the proper dashboards, functionality and validation

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username },
                    { email }
                ]
            }
        });

        if (existingHost || existingUser) {
            return res.status(400).json('Host or User already exists with the same username or email.');
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

const getHostById = async (req, res, next) => {
    const hostId = req.params.id;

    try {
        const host = await prisma.host.findUnique({
            where: {
                id: hostId,
            },
        });

        if (!host) {
            return res.status(404).json('Host not found');
        }

        res.status(200).json(host);
    } catch (error) {
        console.error('Error retrieving host:', error);
        return next({ error: 'Internal Server Error' });
    }
};

const updateHost = async (req, res, next) => {
    const hostId = req.params.id;
    const { username, password, name, email, phoneNumber, profilePicture, aboutMe } = req.body;

    try {
        const existingHost = await prisma.host.findUnique({ where: { id: hostId } });
        if (!existingHost) {
            return res.status(404).json("Host not found");
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

const deleteHost = async (req, res, next) => {
    const hostId = req.params.id;

    try {
        const existingHost = await prisma.host.findUnique({ where: { id: hostId } });
        if (!existingHost) {
            return res.status(404).json("Host not found");
        }

        await prisma.host.delete({ where: { id: hostId } });

        res.status(200).json({ message: 'Host deleted successfully' });
    } catch (error) {
        console.error('Error deleting host:', error);
        return next({ error: 'Internal Server Error' });
    }
};

module.exports = { createHost, getHosts, getHostById, updateHost, deleteHost };
