const { authentication, restrictTo } = require('../controller/authController.js');
const {
  getCourses,
  getUserCourses,
  addCourse,
  addUserToCourse,
  addPostToCourseForum,
  getCourseForumPosts,
  getForumPostDetail,
  getCourseByName, 
} = require('../controller/coursesController.js');

const router = require('express').Router();

router.route('/get-user-courses').get(authentication, getUserCourses);

router.route('/get-all-courses').get(getCourses);

router.route('/get-course-by-name').get(authentication, getCourseByName); // Busca por slug, parámetro "name"

router.route('/add-course').post(authentication, restrictTo('0'), addCourse);

router.route('/add-user-to-course/:id').post(authentication, addUserToCourse);

router.route('/forum/:courseName').get(authentication, getCourseForumPosts);

router.route('/forum/:courseName').post(authentication, addPostToCourseForum);

router.route('/forum/:courseName/:postName').get(authentication, getForumPostDetail);

module.exports = router;
