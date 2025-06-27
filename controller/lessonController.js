const db = require("../db/models");
const { Course, Lesson } = db;
const { Op, fn, col, where, literal, json } = require("sequelize");

// Obtener las lecciones de un curso
const getCourseLessons = async (req, res) => {
  try {
    const courseName = req.query.name;
    const lang = req.query.lang || "es";
    let courseId;

    const course = await Course.findOne({
      where: { slug: courseName },
    });

    if (!course) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    courseId = course.id;

    const lessons = await Lesson.findAll({
      where: { courseId },
      order: [["id", "ASC"]],
    });

    res.status(200).json({
      status: "success",
      course,
      data: lessons,
    });
  } catch (error) {
    console.error("Error al obtener las lecciones:", error);
    res.status(500).json({
      status: "error",
      message: "Error al obtener las lecciones",
    });
  }
};


// Crear nueva lección con contenido en español y alemán
const postLesson = async (req, res) => {
  const { courseId, title, content } = req.body;

  // Validación mínima de estructura
  if (
    !courseId ||
    !title?.es || !title?.de ||
    !Array.isArray(content?.es) ||
    !Array.isArray(content?.de)
  ) {
    return res.status(400).json({
      status: "error",
      message: "Faltan campos obligatorios o formato inválido",
    });
  }

  try {
    const newLesson = await Lesson.create({
      courseId,
      title,
      content,
    });

    res.status(201).json({
      status: "success",
      data: newLesson,
    });
  } catch (error) {
    console.error("Error al crear la lección:", error);
    res.status(500).json({
      status: "error",
      message: "Error al crear la lección",
    });
  }
};

// Eliminar lección por ID
const deleteLesson = async (req, res) => {
  const { lessonId } = req.params;

  try {
    const deleted = await Lesson.destroy({ where: { id: lessonId } });

    if (!deleted) {
      return res.status(404).json({
        status: "error",
        message: "Lección no encontrada",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Lección eliminada correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar la lección:", error);
    res.status(500).json({
      status: "error",
      message: "Error al eliminar la lección",
    });
  }
};

// Actualizar lección
const updateLesson = async (req, res) => {
  const { lessonId } = req.params;
  const updates = req.body;

  try {
    const [updated] = await Lesson.update(updates, { where: { id: lessonId } });

    if (!updated) {
      return res.status(404).json({
        status: "error",
        message: "Lección no encontrada",
      });
    }

    const updatedLesson = await Lesson.findByPk(lessonId);

    res.status(200).json({
      status: "success",
      data: updatedLesson,
    });
  } catch (error) {
    console.error("Error al actualizar la lección:", error);
    res.status(500).json({
      status: "error",
      message: "Error al actualizar la lección",
    });
  }
};

module.exports = {
  getCourseLessons,
  postLesson,
  deleteLesson,
  updateLesson,
};
