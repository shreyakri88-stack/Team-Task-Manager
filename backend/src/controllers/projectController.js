const Project = require("../models/Project");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const logActivity = require("../utils/activityLogger");

const createProject = asyncHandler(async (req, res) => {
  const { name, description, members = [] } = req.body;

  const uniqueMembers = [...new Set(members)];
  const project = await Project.create({
    name,
    description,
    createdBy: req.user._id,
    members: uniqueMembers,
  });

  await logActivity({
    userId: req.user._id,
    action: `Created project: ${project.name}`,
  });

  return res.status(201).json(project);
});

const getProjects = asyncHandler(async (req, res) => {
  const query =
    req.user.role === "admin"
      ? {}
      : {
          $or: [{ createdBy: req.user._id }, { members: req.user._id }],
        };

  const projects = await Project.find(query)
    .populate("createdBy", "name email role")
    .populate("members", "name email role")
    .sort({ createdAt: -1 });

  return res.json(projects);
});

const addMember = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  const member = await User.findById(userId);
  if (!member) return res.status(404).json({ message: "User not found" });

  const project = await Project.findById(id);
  if (!project) return res.status(404).json({ message: "Project not found" });

  const alreadyMember = project.members.some((m) => m.toString() === userId);
  if (!alreadyMember) {
    project.members.push(userId);
    await project.save();
  }

  await logActivity({
    userId: req.user._id,
    action: `Added member to project: ${project.name}`,
  });

  return res.json(project);
});

module.exports = { createProject, getProjects, addMember };
