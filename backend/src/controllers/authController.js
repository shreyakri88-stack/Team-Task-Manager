const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("../utils/asyncHandler");
const logActivity = require("../utils/activityLogger");

const signup = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) {
    return res.status(409).json({ message: "Email already in use" });
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role: role || "member",
  });

  const token = generateToken({ id: user._id, role: user.role });
  await logActivity({ userId: user._id, action: "Signed up" });

  return res.status(201).json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = generateToken({ id: user._id, role: user.role });
  await logActivity({ userId: user._id, action: "Logged in" });

  return res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

module.exports = { signup, login };
