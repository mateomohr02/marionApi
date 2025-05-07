const {
    authentication,
    restrictTo,
  } = require("../controller/authController");
  const {
    getCourseLessons,
    postLesson,
    deleteLesson,
    updateLesson,
  } = require("../controller/lessonController.js");
  
  const router = require("express").Router();
  
  // Obtener todas las lecciones de un curso
  router.get("/:courseId", authentication, getCourseLessons);
  
  // Crear una nueva lección
  router.post("/", authentication, restrictTo("0"), postLesson);
  
  // Actualizar una lección
  router.put("/:lessonId", authentication, restrictTo("0"), updateLesson);
  
  // Eliminar una lección
  router.delete("/:lessonId", authentication, restrictTo("0"), deleteLesson);
  
  module.exports = router;
  
