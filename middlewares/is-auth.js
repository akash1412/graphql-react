const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        req.isAuth = false
        return next()
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        req.isAuth = false;
        return next()
    }
    let decodedToken;
    try {
        decodedToken = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (error) {
        req.isAuth = false;
        return next()
    }

    if (!decodedToken) {
        req.isAuth = false;
        next()
    }

    req.isAuth = true;
    req.userId = decodedToken.id

}