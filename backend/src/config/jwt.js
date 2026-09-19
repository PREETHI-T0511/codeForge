function getJwtSecret() {
    if (!process.env.JWT_SECRET) {
        const error = new Error("JWT_SECRET is not configured");
        error.statusCode = 500;
        throw error;
    }

    return process.env.JWT_SECRET;
}

function getJwtExpiresIn() {
    return process.env.JWT_EXPIRES_IN || "1h";
}

module.exports = {
    getJwtSecret,
    getJwtExpiresIn,
};
