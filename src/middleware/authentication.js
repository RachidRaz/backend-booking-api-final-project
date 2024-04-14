const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {

    const authHeader = req.headers['authorization'];

    const token =authHeader;
    console.log('token')
    if (token == null) next("Token error");

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    
        if (err) next("Wrong");
        req.user = user;
        next();
    });
};

module.exports = { authenticateToken };
