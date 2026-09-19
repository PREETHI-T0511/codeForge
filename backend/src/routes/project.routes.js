const express = require("express");
const { authenticate } = require("../middleware/auth.middleware");
const {
    createProject,
    listProjects,
    getProject,
} = require("../controllers/project.controller");

const router = express.Router();

router.use(authenticate);
router.post("/", createProject);
router.get("/", listProjects);
router.get("/:projectId", getProject);

module.exports = router;
