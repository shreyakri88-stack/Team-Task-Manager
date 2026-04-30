const ActivityLog = require("../models/ActivityLog");

const logActivity = async ({ userId, action }) => {
  if (!userId || !action) return;
  await ActivityLog.create({ user: userId, action });
};

module.exports = logActivity;
