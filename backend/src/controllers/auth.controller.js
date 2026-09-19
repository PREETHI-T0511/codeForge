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

async function login(req, res) {
    try {
        const email = req.body.email?.trim().toLowerCase();
        const { password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const result = await authService.login({ email, password });
        return res.status(200).json({
            message: "Login successful",
            ...result,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.statusCode ? error.message : "Unable to log in",
        });
    }
}

async function getCurrentUser(req, res) {
    try {
        const user = await authService.getUserById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ message: "Unable to retrieve user" });
    }
}

module.exports = {
    register,
    login,
    getCurrentUser,
};
