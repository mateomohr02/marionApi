const { authentication, restrictTo } = require('../controller/authController.js')
const {getCourses, getUserCourses, addCourse, addUserToCourse, addPostToCourseForum, getCourseForumPosts, getForumPostDetail} = require('../controller/coursesController.js');

const router = require('express').Router();

router.route('/get-user-courses').get(authentication, getUserCourses)

router.route('/get-all-courses').get(getCourses);

router.route('/add-course').post(authentication, restrictTo('0'), addCourse);

router.route('/add-user-to-course/:id').post(authentication, addUserToCourse)

router.route('/forum/:id').get(authentication, getCourseForumPosts)

router.route('/forum/:id').post(authentication, addPostToCourseForum)

router.route('/forum/:id/:postId').get(authentication, getForumPostDetail)

module.exports = router;