const jwt = require("jsonwebtoken");
const { getJwtSecret } = require("../config/jwt");

function authenticate(req, res, next) {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authentication token is required" });
    }

    const token = authorization.slice("Bearer ".length);

    try {
        const payload = jwt.verify(token, getJwtSecret());
        req.user = { id: payload.sub, email: payload.email };
        return next();
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message });
        }

        return res.status(401).json({ message: "Invalid or expired authentication token" });
    }
}

module.exports = {
    authenticate,
};
