const Task = require("../models/Task");
const Project = require("../models/Project");
const asyncHandler = require("../utils/asyncHandler");

const getDashboardStats = asyncHandler(async (req, res) => {
  const now = new Date();
  let taskFilter = {};

  if (req.user.role === "member") {
    taskFilter = { assignedTo: req.user._id };
  } else {
    const projects = await Project.find({
      $or: [{ createdBy: req.user._id }, { members: req.user._id }],
    }).select("_id");

    const projectIds = projects.map((p) => p._id);
    taskFilter = {
      $or: [{ createdBy: req.user._id }, { projectId: { $in: projectIds } }],
    };
  }

  const [totalTasks, completedTasks, overdueTasks] = await Promise.all([
    Task.countDocuments(taskFilter),
    Task.countDocuments({ ...taskFilter, status: "done" }),
    Task.countDocuments({
      ...taskFilter,
      status: { $ne: "done" },
      dueDate: { $lt: now },
    }),
  ]);

  return res.json({
    totalTasks,
    completedTasks,
    overdueTasks,
    completionRate: totalTasks ? Number(((completedTasks / totalTasks) * 100).toFixed(2)) : 0,
  });
});

module.exports = { getDashboardStats };
