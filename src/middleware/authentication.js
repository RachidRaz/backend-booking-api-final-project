const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];

        const token = authHeader;
        if (token == null) {
            throw new Error("Missing authorization Token");
        };

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                throw new Error(err.message);
            }

            req.user = user;
            next();
        });
    } catch (error) {
        next(error);
    }

};

module.exports = { authenticateToken };
