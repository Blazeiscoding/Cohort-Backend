import express from "express";
import {
  createSubTask,
  createTask,
  deleteSubTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateSubTask,
  updateTask,
} from "../controllers/task.controllers.js";

const router = express.Router();

router.post("/", createTask);
router.get("/", getTasks);
router.get("/:taskId", getTaskById);
router.put("/:taskId", updateTask);
router.delete("/:taskId", deleteTask);

// Subtasks
router.post("/:taskId/subtasks", createSubTask);
router.put("/:taskId/subtasks/:subtaskId", updateSubTask);
router.delete("/:taskId/subtasks/:subtaskId", deleteSubTask);

export default router;
