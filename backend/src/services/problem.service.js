const prisma = require("../config/prisma");
const projectService = require("./project.service");

function createError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

const problemDetails = {
    id: true,
    title: true,
    description: true,
    difficulty: true,
    tags: true,
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

async function createProblem({ projectId, createdById, title, description, difficulty, tags }) {
    return prisma.problem.create({
        data: {
            projectId,
            createdById,
            title,
            description,
            difficulty,
            tags,
        },
        select: problemDetails,
    });
}

async function listProblemsForUser({ projectId, userId }) {
    const membership = await projectService.getProjectMembership({ projectId, userId });

    if (!membership) {
        throw createError("Project not found", 404);
    }

    return prisma.problem.findMany({
        where: { projectId },
        orderBy: { updatedAt: "desc" },
        select: problemDetails,
    });
}

async function getProblemForUser({ projectId, problemId, userId }) {
    const membership = await projectService.getProjectMembership({ projectId, userId });

    if (!membership) {
        throw createError("Project not found", 404);
    }

    const problem = await prisma.problem.findFirst({
        where: { id: problemId, projectId },
        select: problemDetails,
    });

    if (!problem) {
        throw createError("Problem not found", 404);
    }

    return problem;
}

async function updateProblem({ projectId, problemId, data }) {
    const problem = await prisma.problem.findFirst({
        where: { id: problemId, projectId },
        select: { id: true },
    });

    if (!problem) {
        throw createError("Problem not found", 404);
    }

    return prisma.problem.update({
        where: { id: problemId },
        data,
        select: problemDetails,
    });
}

async function deleteProblem({ projectId, problemId }) {
    const problem = await prisma.problem.findFirst({
        where: { id: problemId, projectId },
        select: { id: true },
    });

    if (!problem) {
        throw createError("Problem not found", 404);
    }

    await prisma.problem.delete({ where: { id: problemId } });
}

module.exports = {
    createProblem,
    listProblemsForUser,
    getProblemForUser,
    updateProblem,
    deleteProblem,
};
