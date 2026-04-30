const Project = require("../models/Project");
const asyncHandler = require("../utils/asyncHandler");

const ensureProjectAccess = asyncHandler(async (req, res, next) => {
  const projectId = req.params.projectId || req.body.projectId || req.params.id;
  if (!projectId) return res.status(400).json({ message: "Project ID is required" });

  const project = await Project.findById(projectId);
  if (!project) return res.status(404).json({ message: "Project not found" });

  const isAdmin = req.user.role === "admin";
  const isCreator = project.createdBy.toString() === req.user._id.toString();
  const isMember = project.members.some((m) => m.toString() === req.user._id.toString());

  if (!isAdmin && !isCreator && !isMember) {
    return res.status(403).json({ message: "Forbidden: No project access" });
  }

  req.project = project;
  return next();
});

module.exports = ensureProjectAccess;
