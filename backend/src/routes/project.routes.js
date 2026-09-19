const express = require("express");
const { authenticate } = require("../middleware/auth.middleware");
const {
    createProject,
    listProjects,
    getProject,
} = require("../controllers/project.controller");
const {
    listMembers,
    addMember,
    updateMemberRole,
    removeMember,
} = require("../controllers/project-member.controller");

const router = express.Router();

router.use(authenticate);
router.post("/", createProject);
router.get("/", listProjects);
router.get("/:projectId/members", listMembers);
router.post("/:projectId/members", addMember);
router.patch("/:projectId/members/:userId", updateMemberRole);
router.delete("/:projectId/members/:userId", removeMember);
router.get("/:projectId", getProject);

module.exports = router;
