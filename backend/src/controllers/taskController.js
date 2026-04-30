const Task = require("../models/Task");
const Project = require("../models/Project");
const asyncHandler = require("../utils/asyncHandler");
const logActivity = require("../utils/activityLogger");

const canModifyTask = (user, task) =>
  user.role === "admin" || task.assignedTo.toString() === user._id.toString();

const createTask = asyncHandler(async (req, res) => {
  const { title, description, projectId, assignedTo, status, dueDate, priority } = req.body;

  const project = await Project.findById(projectId);
  if (!project) return res.status(404).json({ message: "Project not found" });

  const isAssignedMember = project.members.some((m) => m.toString() === assignedTo);
  const isAssignedCreator = project.createdBy.toString() === assignedTo;
  if (!isAssignedMember && !isAssignedCreator) {
    return res
      .status(400)
      .json({ message: "Assigned user must be project creator or a project member" });
  }

  const task = await Task.create({
    title,
    description,
    projectId,
    assignedTo,
    status,
    dueDate,
    priority,
    createdBy: req.user._id,
  });

  await logActivity({ userId: req.user._id, action: `Created task: ${task.title}` });
  return res.status(201).json(task);
});

const getTasksByProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findById(projectId);
  if (!project) return res.status(404).json({ message: "Project not found" });

  const isAdmin = req.user.role === "admin";
  const isCreator = project.createdBy.toString() === req.user._id.toString();
  const isMember = project.members.some((m) => m.toString() === req.user._id.toString());
  if (!isAdmin && !isCreator && !isMember) {
    return res.status(403).json({ message: "Forbidden: No project access" });
  }

  const query =
    req.user.role === "member"
      ? { projectId, assignedTo: req.user._id }
      : { projectId };

  const tasks = await Task.find(query)
    .populate("assignedTo", "name email role")
    .populate("projectId", "name")
    .sort({ createdAt: -1 });

  return res.json(tasks);
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });

  if (!canModifyTask(req.user, task)) {
    return res.status(403).json({ message: "Forbidden: Cannot update this task" });
  }

  const fields = ["title", "description", "assignedTo", "status", "dueDate", "priority"];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) task[field] = req.body[field];
  });

  await task.save();
  await logActivity({ userId: req.user._id, action: `Updated task: ${task.title}` });

  return res.json(task);
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Only admins can delete tasks" });
  }

  await task.deleteOne();
  await logActivity({ userId: req.user._id, action: `Deleted task: ${task.title}` });

  return res.json({ message: "Task deleted successfully" });
});

module.exports = { createTask, getTasksByProject, updateTask, deleteTask };
