const { validationResult } = require("express-validator");
const Course = require('../models/course.model');
const { SUCCESS, FAIL } = require("../utils/httpStatusText");
const asyncWrapper = require("../middlewares/asyncWrapper");
const errorHandler = require("../utils/errorHandler");

// Get All Courses
const getAllCourses = asyncWrapper(async (req, res) => {
  // pagination
  const { limit = 10, page = 1 } = req.query;
  const limitNum = parseInt(limit);
  const skip = (page - 1) * limit;

  const courses = await Course.find({}, { __v: false })
    .limit(limitNum)
    .skip(skip);
  res.json({ status: SUCCESS, data: { courses } });
});

// Get Single Course
const getCourse = asyncWrapper(async (req, res, next) => {
  const courseId = req.params.courseId;
  const course = await Course.findById(courseId);
  if (!course) {
    const error = errorHandler.create("Course not found", 404, FAIL);
    return next(error);
  }
  res.json({ status: SUCCESS, data: { course } });
});

// Add Course
const addCourse = asyncWrapper(async (req, res, next) => {
  // Express-Validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = errorHandler.create(errors.array(), 400, FAIL);
    return next(error)
  }
  const newCourse = new Course(req.body);
  await newCourse.save();
  res.status(201).json({ status: SUCCESS, data: { course: newCourse } }); // 201 => Created
});

// Update Course
const updateCourse = asyncWrapper(async (req, res) => {
  const courseId = req.params.courseId;
  const updatedCourse = await Course.findByIdAndUpdate(
    courseId,
    { $set: { ...req.body } }, // change req.body
    { new: true } // return updated course not old one
  );
  return res.status(200).json({ status: SUCCESS, data: { course: updatedCourse } });
  
});

// Delete Course
const deleteCourse = asyncWrapper(async (req, res) => {
  await Course.deleteOne({ _id: req.params.courseId });
  res.status(200).json({status: SUCCESS, data: null});
});

module.exports = {
  getAllCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse
}