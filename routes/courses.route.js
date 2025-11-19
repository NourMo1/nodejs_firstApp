const express = require("express");
const courseController = require("../controllers/courses.controller");
const { validationSchema } = require("../middlewares/validation");
const verifyToken = require("../middlewares/verifyToken");
const allowedTo = require("../middlewares/allowedTo");

const router = express.Router();

router
  .route("/")
  .get(courseController.getAllCourses)
  .post( verifyToken, allowedTo('admin'), validationSchema() ,courseController.addCourse);
router
  .route("/:courseId")
  .get(courseController.getCourse)
  .patch(verifyToken, allowedTo('admin'), courseController.updateCourse)
  .delete(verifyToken, allowedTo('admin'), courseController.deleteCourse);

module.exports = router