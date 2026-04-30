const express = require("express");
const { body, param } = require("express-validator");
const {
  createProject,
  getProjects,
  addMember,
} = require("../controllers/projectController");
const { protect, authorize } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

router.use(protect);

router.post(
  "/",
  authorize("admin"),
  [body("name").trim().notEmpty().withMessage("Project name is required")],
  validateRequest,
  createProject
);

router.get("/", getProjects);

router.post(
  "/:id/add-member",
  authorize("admin"),
  [
    param("id").isMongoId().withMessage("Valid project id is required"),
    body("userId").isMongoId().withMessage("Valid user id is required"),
  ],
  validateRequest,
  addMember
);

module.exports = router;
