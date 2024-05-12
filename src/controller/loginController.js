const prisma = require("../prisma");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const login = async (req, res, next) => {

    // the chance that a user / host share a similar username and password is low but still significant (the register endpoint prevents duplication between the users/hosts username and password)
    // alternatively we could combine users and hosts into one table (users table), each user will have a login account (logins table) w/ an username/password
    // this way hosts can be a guests too, making a booking to a property - unless the platform is designed to function differently with two dashboards for each hosts and users/guests
    // but even then it would make sense to have them operate the same and have a dashboard/user type that displays the proper dashboards, functionality and validation

    try {
        const { username, password } = req.body;

        // check if user or host exist
        const user = await prisma.user.findUnique({
            where: {
                username
            }
        });

        const host = await prisma.host.findUnique({
            where: {
                username
            }
        });

        if (!user && !host) {
            return res.status(401).json('Invalid username or password');
        }

        // validate password for user/ host, we already checked if username is a match
        const passwordMatch = user ? await bcrypt.compare(password, user.password) : await bcrypt.compare(password, host.password);

        if (!passwordMatch) {
            return res.status(401).json('Invalid username or password');
        }

        // generate JWT token for authorised endpoints
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        next(error);
    }

};

module.exports = { login }