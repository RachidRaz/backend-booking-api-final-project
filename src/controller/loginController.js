const prisma = require("../prisma");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const login = async (req, res, next) => {

    // the chance that a user / host share a similar username and password is low but still significant (the register endpoint prevents duplication between the users/hosts username and password)
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
            return next({ message: 'Invalid username or password' });
        }

        // validate password for user/ host, we already checked if username is a match
        const passwordMatch = user ? await bcrypt.compare(password, user.password) : await bcrypt.compare(password, host.password);

        if (!passwordMatch) {
            return next({ message: 'Invalid username or password' });
        }

        // generate JWT token for authorised endpoints
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        next(error);
    }

};

module.exports = { login }