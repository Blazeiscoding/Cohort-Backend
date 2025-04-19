import express from "express";
import {
  addMemberToProject,
  createProject,
  deleteMember,
  deleteProject,
  getProjectById,
  getProjectMembers,
  getProjects,
  updateMemberRole,
  updateProject,
} from "../controllers/project.controllers.js";

const router = express.Router();

router.post("/", createProject);
router.get("/", getProjects);
router.get("/:projectId", getProjectById);
router.put("/:projectId", updateProject);
router.delete("/:projectId", deleteProject);

// Member routes
router.post("/:projectId/members", addMemberToProject);
router.get("/:projectId/members", getProjectMembers);
router.put("/:projectId/members/:memberId", updateMemberRole);
router.delete("/:projectId/members/:memberId", deleteMember);

export default router;
