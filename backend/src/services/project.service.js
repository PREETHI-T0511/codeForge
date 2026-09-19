const prisma = require("../config/prisma");

const projectDetails = {
    id: true,
    name: true,
    description: true,
    createdAt: true,
    updatedAt: true,
    createdBy: {
        select: {
            id: true,
            name: true,
            email: true,
        },
    },
};

async function createProject({ name, description, userId }) {
    return prisma.project.create({
        data: {
            name,
            description,
            createdById: userId,
            members: {
                create: {
                    userId,
                    role: "OWNER",
                },
            },
        },
        select: projectDetails,
    });
}

async function listProjectsForUser(userId) {
    const memberships = await prisma.projectMember.findMany({
        where: { userId },
        orderBy: { project: { updatedAt: "desc" } },
        select: {
            role: true,
            joinedAt: true,
            project: {
                select: projectDetails,
            },
        },
    });

    return memberships.map(({ project, role, joinedAt }) => ({
        ...project,
        role,
        joinedAt,
    }));
}

async function getProjectForUser({ projectId, userId }) {
    return prisma.project.findFirst({
        where: {
            id: projectId,
            members: {
                some: { userId },
            },
        },
        select: {
            ...projectDetails,
            members: {
                orderBy: { joinedAt: "asc" },
                select: {
                    role: true,
                    joinedAt: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            },
        },
    });
}

module.exports = {
    createProject,
    listProjectsForUser,
    getProjectForUser,
};
