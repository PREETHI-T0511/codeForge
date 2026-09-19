const prisma = require("../config/prisma");

function createError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

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

async function getProjectMembership({ projectId, userId }) {
    return prisma.projectMember.findUnique({
        where: {
            projectId_userId: { projectId, userId },
        },
    });
}

async function requireProjectOwner({ projectId, userId }) {
    const membership = await getProjectMembership({ projectId, userId });

    if (!membership) {
        throw createError("Project not found", 404);
    }

    if (membership.role !== "OWNER") {
        throw createError("Only the project owner can manage members", 403);
    }
}

async function listProjectMembers({ projectId, userId }) {
    const membership = await getProjectMembership({ projectId, userId });

    if (!membership) {
        throw createError("Project not found", 404);
    }

    return prisma.projectMember.findMany({
        where: { projectId },
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
    });
}

async function addProjectMember({ projectId, email }) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        throw createError("User not found", 404);
    }

    const existingMembership = await getProjectMembership({ projectId, userId: user.id });

    if (existingMembership) {
        throw createError("User is already a project member", 409);
    }

    return prisma.projectMember.create({
        data: {
            projectId,
            userId: user.id,
            role: "MEMBER",
        },
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
    });
}

async function updateProjectMemberRole({ projectId, userId, role }) {
    const membership = await getProjectMembership({ projectId, userId });

    if (!membership) {
        throw createError("Project member not found", 404);
    }

    if (membership.role === "OWNER") {
        throw createError("The project owner cannot be demoted", 400);
    }

    return prisma.projectMember.update({
        where: {
            projectId_userId: { projectId, userId },
        },
        data: { role },
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
    });
}

async function removeProjectMember({ projectId, userId }) {
    const membership = await getProjectMembership({ projectId, userId });

    if (!membership) {
        throw createError("Project member not found", 404);
    }

    if (membership.role === "OWNER") {
        throw createError("The project owner cannot be removed", 400);
    }

    await prisma.projectMember.delete({
        where: {
            projectId_userId: { projectId, userId },
        },
    });
}

module.exports = {
    createProject,
    listProjectsForUser,
    getProjectForUser,
    requireProjectOwner,
    listProjectMembers,
    addProjectMember,
    updateProjectMemberRole,
    removeProjectMember,
};
