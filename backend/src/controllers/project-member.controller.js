const projectService = require("../services/project.service");

async function listMembers(req, res) {
    try {
        const members = await projectService.listProjectMembers({
            projectId: req.params.projectId,
            userId: req.user.id,
        });

        return res.status(200).json({ members });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.statusCode ? error.message : "Unable to retrieve project members",
        });
    }
}

async function addMember(req, res) {
    try {
        const email = req.body.email?.trim().toLowerCase();

        if (!email) {
            return res.status(400).json({ message: "Member email is required" });
        }

        await projectService.requireProjectOwner({
            projectId: req.params.projectId,
            userId: req.user.id,
        });

        const member = await projectService.addProjectMember({
            projectId: req.params.projectId,
            email,
        });

        return res.status(201).json({ member });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.statusCode ? error.message : "Unable to add project member",
        });
    }
}

async function updateMemberRole(req, res) {
    try {
        const { role } = req.body;

        if (!["ADMIN", "MEMBER"].includes(role)) {
            return res.status(400).json({ message: "Role must be ADMIN or MEMBER" });
        }

        await projectService.requireProjectOwner({
            projectId: req.params.projectId,
            userId: req.user.id,
        });

        const member = await projectService.updateProjectMemberRole({
            projectId: req.params.projectId,
            userId: req.params.userId,
            role,
        });

        return res.status(200).json({ member });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.statusCode ? error.message : "Unable to update member role",
        });
    }
}

async function removeMember(req, res) {
    try {
        await projectService.requireProjectOwner({
            projectId: req.params.projectId,
            userId: req.user.id,
        });

        await projectService.removeProjectMember({
            projectId: req.params.projectId,
            userId: req.params.userId,
        });

        return res.status(204).send();
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.statusCode ? error.message : "Unable to remove project member",
        });
    }
}

module.exports = {
    listMembers,
    addMember,
    updateMemberRole,
    removeMember,
};
