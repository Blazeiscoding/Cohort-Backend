import { Task } from "../models/task.model.js";
import { SubTask } from "../models/subtask.models.js";
// get all tasks
const getTasks = async (req, res) => {
  // get all tasks
  const task = await Task.find({ project: req.params.id }.populate("project"));

  if (!task) {
    return res.status(400).json({
      message: "No tasks found",
    });
  }
  return res.status(200).json({
    message: "Tasks found",
    task,
  });
};

// get task by id
const getTaskById = async (req, res) => {
  // get task by id
  const task = await Task.findOne({ _id: req.params.id });
  if (!task) {
    return res.status(400).json({
      message: "No tasks found",
    });
  }
  return res.status(200).json({
    message: "Task found",
    task,
  });
};

// create task
const createTask = async (req, res) => {
  // create task
  const task = await Task.create(req.body);
  if (!task) {
    return res.status(400).json({
      message: "Task not created",
    });
  }
  return res.status(200).json({
    message: "Task created",
    task,
  });
};

// update task
const updateTask = async (req, res) => {
  // update task
  const task = await Task.findOne({ _id: req.params.id });
  if (!task) {
    return res.status(400).json({
      message: "Task not found",
    });
  }
  task.title = req.body.title;
  task.description = req.body.description;
  await task.save();
  return res.status(200).json({
    message: "Task updated",
    task,
  });
};

// delete task
const deleteTask = async (req, res) => {
  // delete task
  const task = await Task.findOne({ _id: req.params.id });
  if (!task) {
    return res.status(400).json({
      message: "Task not found",
    });
  }
  await task.deleteOne();
  return res.status(200).json({
    message: "Task deleted",
    task,
  });
};

// create subtask
const createSubTask = async (req, res) => {
  // create subtask
  const subtask = await SubTask.create(req.body);
  if (!subtask) {
    return res.status(400).json({
      message: "Subtask not created",
    });
  }
  return res.status(200).json({
    message: "Subtask created",
    subtask,
  });
};

// update subtask
const updateSubTask = async (req, res) => {
  // update subtask
  const subtask = await SubTask.findOne({ _id: req.params.id });
  if (!subtask) {
    return res.status(400).json({
      message: "Subtask not found",
    });
  }
  subtask.title = req.body.title;
  subtask.task = req.body.task;
  subtask.isCompleted = req.body.isCompleted;
  await subtask.save();
  return res.status(200).json({
    message: "Subtask updated",
    subtask,
  });
};

// delete subtask
const deleteSubTask = async (req, res) => {
  // delete subtask
  const subtask = await SubTask.findOne({ _id: req.params.id });
  if (!subtask) {
    return res.status(400).json({
      message: "Subtask not found",
    });
  }
  await subtask.deleteOne();
  return res.status(200).json({
    message: "Subtask deleted",
    subtask,
  });
};

export {
  createSubTask,
  createTask,
  deleteSubTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateSubTask,
  updateTask,
};
