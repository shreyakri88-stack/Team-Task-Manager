const express = require("express");
const { body, param } = require("express-validator");
const {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const { protect, authorize } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();
router.use(protect);

router.post(
  "/",
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("projectId").isMongoId().withMessage("Valid project id is required"),
    body("assignedTo").isMongoId().withMessage("Valid assignedTo user id is required"),
    body("status")
      .optional()
      .isIn(["todo", "in-progress", "done"])
      .withMessage("Invalid status"),
    body("priority")
      .optional()
      .isIn(["low", "medium", "high"])
      .withMessage("Invalid priority"),
    body("dueDate").optional().isISO8601().withMessage("Invalid dueDate format"),
  ],
  validateRequest,
  createTask
);

router.get(
  "/:projectId",
  [param("projectId").isMongoId().withMessage("Valid project id is required")],
  validateRequest,
  getTasksByProject
);

router.put(
  "/:id",
  [
    param("id").isMongoId().withMessage("Valid task id is required"),
    body("status")
      .optional()
      .isIn(["todo", "in-progress", "done"])
      .withMessage("Invalid status"),
    body("priority")
      .optional()
      .isIn(["low", "medium", "high"])
      .withMessage("Invalid priority"),
    body("dueDate").optional().isISO8601().withMessage("Invalid dueDate format"),
  ],
  validateRequest,
  updateTask
);

router.delete(
  "/:id",
  authorize("admin"),
  [param("id").isMongoId().withMessage("Valid task id is required")],
  validateRequest,
  deleteTask
);

module.exports = router;
