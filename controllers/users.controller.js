const asyncWrapper = require("../middlewares/asyncWrapper");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const errorHandler = require("../utils/errorHandler");
const { SUCCESS,ERROR } = require("../utils/httpStatusText");

// Get All Users
const getAllUsers = asyncWrapper(async (req, res) => {
  // pagination
  const { limit = 10, page = 1 } = req.query;
  const limitNum = parseInt(limit);
  const skip = (page - 1) * limit;

  const users = await User.find({}, { __v: false, password: false })
    .limit(limitNum)
    .skip(skip);
  res.json({ status: SUCCESS, data: { users } });
})

// Register User
const register = asyncWrapper(async(req, res, next) => {
  const { firstName, lastName, email, password, role } = req.body;
  const emailExists = await User.findOne({ email });
  if (emailExists) {
    const error = errorHandler.create("Email already exists", 400, ERROR);
    return next(error);
  }
  // Hash password before saving (omitted for brevity)
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ firstName, lastName, email, password: hashedPassword, role, avatar: req.file.filename });
  // Generate JWT Token
  const token = await jwt.sign({ email: user.email, id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
  user.token = token;
  await user.save();
  res.status(201).json({ status: SUCCESS, data: { user } }); // 201 => Created
})

// Login User
const login = asyncWrapper(async(req, res, next) => {
  const { email, password } = req.body;
  if (email && !password) {
    const error = errorHandler.create("Password is required", 400, ERROR);
    return next(error);
  } else if (!email && password) {
    const error = errorHandler.create("Email is required", 400, ERROR);
    return next(error);
  } else if (!email && !password) {
    const error = errorHandler.create("Email and Password are required", 400, ERROR);
    return next(error);
  }
  
  const user = await User.findOne({ email });
  if (!user) {
    const error = errorHandler.create("User is not found", 401, ERROR);
    return next(error);
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (user && isMatch) {
    const token = await jwt.sign(
      { email: user.email, id: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );
    return res.json({ status: SUCCESS, message: "Logged in successfully", data: { token } });
  } else {
    const error = errorHandler.create("Invalid email or password", 401, ERROR);
    return next(error);
  }
})  

module.exports = {
  getAllUsers,
  login,
  register
};