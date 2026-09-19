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
const {
    createProblem,
    listProblems,
    getProblem,
    updateProblem,
    deleteProblem,
} = require("../controllers/problem.controller");

const router = express.Router();

router.use(authenticate);
router.post("/", createProject);
router.get("/", listProjects);
router.get("/:projectId/members", listMembers);
router.post("/:projectId/members", addMember);
router.patch("/:projectId/members/:userId", updateMemberRole);
router.delete("/:projectId/members/:userId", removeMember);
router.post("/:projectId/problems", createProblem);
router.get("/:projectId/problems", listProblems);
router.get("/:projectId/problems/:problemId", getProblem);
router.patch("/:projectId/problems/:problemId", updateProblem);
router.delete("/:projectId/problems/:problemId", deleteProblem);
router.get("/:projectId", getProject);

module.exports = router;
