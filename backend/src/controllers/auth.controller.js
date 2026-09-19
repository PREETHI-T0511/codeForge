const authService = require("../services/auth.service");

async function register(req, res) {
    try {
        const name = req.body.name?.trim();
        const email = req.body.email?.trim().toLowerCase();
        const { password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required" });
        }

        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({ message: "A valid email address is required" });
        }

        if (typeof password !== "string" || password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }

        const user = await authService.register({
            name,
            email,
            password,
        });

        return res.status(201).json({
            message: "User registered successfully",
            user,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.statusCode ? error.message : "Unable to register user",
        });
    }
}
module.exports = {
    register,
};
