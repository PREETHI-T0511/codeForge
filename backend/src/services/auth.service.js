const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");
const { getJwtSecret, getJwtExpiresIn } = require("../config/jwt");

async function register({ name, email, password }) {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
        const error = new Error("A user with this email already exists");
        error.statusCode = 409;
        throw error;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
        data: { name, email, passwordHash },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
        },
    });

    return user;
}

async function login({ email, password }) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    const token = jwt.sign(
        { email: user.email },
        getJwtSecret(),
        { subject: user.id, expiresIn: getJwtExpiresIn() }
    );

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
        },
    };
}

async function getUserById(id) {
    return prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
        },
    });
}

module.exports = {
    register,
    login,
    getUserById,
};
