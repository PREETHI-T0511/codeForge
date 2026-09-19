const prisma = require("../config/prisma");
const projectService = require("./project.service");

function createError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

const submissionDetails = {
    id: true,
    sourceCode: true,
    language: true,
    status: true,
    output: true,
    error: true,
    executionTimeMs: true,
    createdAt: true,
    updatedAt: true,
    user: {
        select: {
            id: true,
            name: true,
            email: true,
        },
    },
};

async function getProblemInProject({ projectId, problemId }) {
    const problem = await prisma.problem.findFirst({
        where: { id: problemId, projectId },
        select: { id: true },
    });

    if (!problem) {
        throw createError("Problem not found", 404);
    }
}

async function createSubmission({ projectId, problemId, userId, sourceCode, language }) {
    await getProblemInProject({ projectId, problemId });

    return prisma.submission.create({
        data: {
            problemId,
            userId,
            sourceCode,
            language,
        },
        select: submissionDetails,
    });
}

async function listSubmissionsForUser({ projectId, problemId, userId }) {
    await getProblemInProject({ projectId, problemId });

    const membership = await projectService.getProjectMembership({ projectId, userId });
    if (!membership) {
        throw createError("Project not found", 404);
    }

    return prisma.submission.findMany({
        where: {
            problemId,
            ...(membership.role === "MEMBER" ? { userId } : {}),
        },
        orderBy: { createdAt: "desc" },
        select: submissionDetails,
    });
}

async function getSubmissionForUser({ projectId, problemId, submissionId, userId }) {
    await getProblemInProject({ projectId, problemId });

    const membership = await projectService.getProjectMembership({ projectId, userId });
    if (!membership) {
        throw createError("Project not found", 404);
    }

    const submission = await prisma.submission.findFirst({
        where: { id: submissionId, problemId },
        select: submissionDetails,
    });

    if (!submission || (membership.role === "MEMBER" && submission.user.id !== userId)) {
        throw createError("Submission not found", 404);
    }

    return submission;
}

module.exports = {
    createSubmission,
    listSubmissionsForUser,
    getSubmissionForUser,
};
