const prisma = require("../prisma");
const bcrypt = require('bcrypt');

const getUsers = async (req, res, next) => {
    try {
        const conditions = {};

        // grab the optional params from the url, defaults to no conditions
        req.query.email ? conditions.email = req.query.email : null;
        req.query.username ? conditions.username = req.query.username : null;

        const users = await prisma.user.findMany({
            where: conditions
        });

        res.status(200).json({ users })
    } catch (error) {
        next(error);
    }
}

const UserRegister = async (req, res, next) => {
    const { username, password, name, email, phoneNumber, profilePicture } = req.body;

    try {
        // check if the user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username },
                    { email }
                ]
            }
        });

        // Check if the host already exists since the login endpoint is both for users as hosts
        const existingHost = await prisma.host.findFirst({
            where: {
                OR: [
                    { username },
                    { email }
                ]
            }
        });

        if (existingUser || existingHost) {
            return next({ message: 'User or Host already exists with the same username or email.' });
        }

        // hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create the new user with hashed password
        const newUser = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                name,
                email,
                phoneNumber,
                profilePicture
            }
        });

        return res.status(200).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        next(error);
    }

};

const getUserById = async (req, res, next) => {

    try {
        const userId = req.params.id;

        // find user w/ ID
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            return next({ message: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        next(error);
    }
};

const updateUser = async (req, res, next) => {

    try {
        const userId = req.params.id;
        const { username, password, name, email, phoneNumber, profilePicture } = req.body;

        // find user w/ id
        const existingUser = await prisma.user.findUnique({ where: { id: userId } });

        if (!existingUser) {
            return next({ message: 'User not found' });
        }

        // when password is provided, generate hashed password
        let hashedPassword;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // update users w/ provided datapoints or keep existing details
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                username: username || existingUser.username,
                password: hashedPassword || existingUser.password,
                name: name || existingUser.name,
                email: email || existingUser.email,
                phoneNumber: phoneNumber || existingUser.phoneNumber,
                profilePicture: profilePicture || existingUser.profilePicture
            }
        });

        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        next(error);
    }

};
const deleteUser = async (req, res, next) => {

    try {
        const userId = req.params.id;

        // find user w/ ID
        const existingUser = await prisma.user.findUnique({ where: { id: userId } });
        if (!existingUser) {
            return next({ message: 'User not found' });
        }

        // delete user from users table
        await prisma.user.delete({ where: { id: userId } });

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = { UserRegister, getUserById, updateUser, deleteUser, getUsers }