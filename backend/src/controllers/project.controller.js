const projectService = require("../services/project.service");

async function createProject(req, res) {
    try {
        const name = req.body.name?.trim();
        const description = req.body.description?.trim() || null;

        if (!name) {
            return res.status(400).json({ message: "Project name is required" });
        }

        const project = await projectService.createProject({
            name,
            description,
            userId: req.user.id,
        });

        return res.status(201).json({ project });
    } catch (error) {
        return res.status(500).json({ message: "Unable to create project" });
    }
}

async function listProjects(req, res) {
    try {
        const projects = await projectService.listProjectsForUser(req.user.id);
        return res.status(200).json({ projects });
    } catch (error) {
        return res.status(500).json({ message: "Unable to retrieve projects" });
    }
}

async function getProject(req, res) {
    try {
        const project = await projectService.getProjectForUser({
            projectId: req.params.projectId,
            userId: req.user.id,
        });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        return res.status(200).json({ project });
    } catch (error) {
        return res.status(500).json({ message: "Unable to retrieve project" });
    }
}

module.exports = {
    createProject,
    listProjects,
    getProject,
};
