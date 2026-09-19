const projectService = require("../services/project.service");
const submissionService = require("../services/submission.service");

const languages = ["JAVASCRIPT", "PYTHON", "CPP", "JAVA"];

async function createSubmission(req, res) {
    try {
        const { sourceCode, language } = req.body;

        if (typeof sourceCode !== "string" || !sourceCode.trim()) {
            return res.status(400).json({ message: "Source code is required" });
        }

        if (!languages.includes(language)) {
            return res.status(400).json({ message: "Language must be JAVASCRIPT, PYTHON, CPP, or JAVA" });
        }

        const membership = await projectService.getProjectMembership({
            projectId: req.params.projectId,
            userId: req.user.id,
        });

        if (!membership) {
            return res.status(404).json({ message: "Project not found" });
        }

        const submission = await submissionService.createSubmission({
            projectId: req.params.projectId,
            problemId: req.params.problemId,
            userId: req.user.id,
            sourceCode,
            language,
        });

        return res.status(201).json({ submission });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.statusCode ? error.message : "Unable to create submission",
        });
    }
}

async function listSubmissions(req, res) {
    try {
        const submissions = await submissionService.listSubmissionsForUser({
            projectId: req.params.projectId,
            problemId: req.params.problemId,
            userId: req.user.id,
        });

        return res.status(200).json({ submissions });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.statusCode ? error.message : "Unable to retrieve submissions",
        });
    }
}

async function getSubmission(req, res) {
    try {
        const submission = await submissionService.getSubmissionForUser({
            projectId: req.params.projectId,
            problemId: req.params.problemId,
            submissionId: req.params.submissionId,
            userId: req.user.id,
        });

        return res.status(200).json({ submission });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.statusCode ? error.message : "Unable to retrieve submission",
        });
    }
}

module.exports = {
    createSubmission,
    listSubmissions,
    getSubmission,
};
