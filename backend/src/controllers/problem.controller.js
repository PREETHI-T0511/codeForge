const problemService = require("../services/problem.service");
const projectService = require("../services/project.service");

const difficulties = ["EASY", "MEDIUM", "HARD"];

function normalizeTags(tags) {
    if (tags === undefined) {
        return undefined;
    }

    if (!Array.isArray(tags) || !tags.every((tag) => typeof tag === "string" && tag.trim())) {
        const error = new Error("Tags must be an array of non-empty strings");
        error.statusCode = 400;
        throw error;
    }

    return [...new Set(tags.map((tag) => tag.trim().toLowerCase()))];
}

function buildProblemData(body, { partial = false } = {}) {
    const data = {};

    if (!partial || body.title !== undefined) {
        const title = body.title?.trim();
        if (!title) {
            const error = new Error("Problem title is required");
            error.statusCode = 400;
            throw error;
        }
        data.title = title;
    }

    if (!partial || body.description !== undefined) {
        const description = body.description?.trim();
        if (!description) {
            const error = new Error("Problem description is required");
            error.statusCode = 400;
            throw error;
        }
        data.description = description;
    }

    if (!partial || body.difficulty !== undefined) {
        if (!difficulties.includes(body.difficulty)) {
            const error = new Error("Difficulty must be EASY, MEDIUM, or HARD");
            error.statusCode = 400;
            throw error;
        }
        data.difficulty = body.difficulty;
    }

    const tags = normalizeTags(body.tags);
    if (tags !== undefined) {
        data.tags = tags;
    } else if (!partial) {
        data.tags = [];
    }

    return data;
}

async function createProblem(req, res) {
    try {
        await projectService.requireProjectManager({
            projectId: req.params.projectId,
            userId: req.user.id,
        });

        const problem = await problemService.createProblem({
            projectId: req.params.projectId,
            createdById: req.user.id,
            ...buildProblemData(req.body),
        });

        return res.status(201).json({ problem });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.statusCode ? error.message : "Unable to create problem",
        });
    }
}

async function listProblems(req, res) {
    try {
        const problems = await problemService.listProblemsForUser({
            projectId: req.params.projectId,
            userId: req.user.id,
        });

        return res.status(200).json({ problems });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.statusCode ? error.message : "Unable to retrieve problems",
        });
    }
}

async function getProblem(req, res) {
    try {
        const problem = await problemService.getProblemForUser({
            projectId: req.params.projectId,
            problemId: req.params.problemId,
            userId: req.user.id,
        });

        return res.status(200).json({ problem });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.statusCode ? error.message : "Unable to retrieve problem",
        });
    }
}

async function updateProblem(req, res) {
    try {
        await projectService.requireProjectManager({
            projectId: req.params.projectId,
            userId: req.user.id,
        });

        const data = buildProblemData(req.body, { partial: true });
        if (Object.keys(data).length === 0) {
            return res.status(400).json({ message: "Provide at least one problem field to update" });
        }

        const problem = await problemService.updateProblem({
            projectId: req.params.projectId,
            problemId: req.params.problemId,
            data,
        });

        return res.status(200).json({ problem });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.statusCode ? error.message : "Unable to update problem",
        });
    }
}

async function deleteProblem(req, res) {
    try {
        await projectService.requireProjectManager({
            projectId: req.params.projectId,
            userId: req.user.id,
        });

        await problemService.deleteProblem({
            projectId: req.params.projectId,
            problemId: req.params.problemId,
        });

        return res.status(204).send();
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.statusCode ? error.message : "Unable to delete problem",
        });
    }
}

module.exports = {
    createProblem,
    listProblems,
    getProblem,
    updateProblem,
    deleteProblem,
};
