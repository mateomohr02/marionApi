const {getCourses, getUserCourses, addCourse} = require('../controller/coursesController.js');

const router = require('express').Router();

router.route('/get-all-courses').get(getCourses);

router.route('/add-course').post(addCourse);

module.exports = router;