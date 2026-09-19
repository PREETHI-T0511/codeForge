const bcrypt = require("bcrypt");
const prisma = require("../config/prisma");

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

module.exports = {
    register,
};
