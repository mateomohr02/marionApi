const db = require("../db/models");
const { Course: Course, Lesson: Lesson } = db;

const getCourseLessons = async (req, res) => {
  const { courseId } = req.params;

  try {
    const lessons = await Lesson.findAll({
      where: { courseId },
      order: [['id', 'ASC']],
    });

    res.status(200).json({
      status: 'success',
      data: lessons,
    });
  } catch (error) {
    console.error('Error al obtener las lecciones:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener las lecciones',
    });
  }
};

const postLesson = async (req, res) => {
  const lesson = req.body;

  try {
    const newLesson = await Lesson.create(lesson);

    res.status(201).json({
      status: 'success',
      data: newLesson,
    });
  } catch (error) {
    console.error('Error al crear la lección:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al crear la lección',
    });
  }
};

const deleteLesson = async (req, res) => {
  const { lessonId } = req.params;

  try {
    const deleted = await Lesson.destroy({ where: { id: lessonId } });

    if (!deleted) {
      return res.status(404).json({
        status: 'error',
        message: 'Lección no encontrada',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Lección eliminada correctamente',
    });
  } catch (error) {
    console.error('Error al eliminar la lección:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al eliminar la lección',
    });
  }
};

const updateLesson = async (req, res) => {
  const { lessonId } = req.params;
  const updates = req.body;

  try {
    const [updated] = await Lesson.update(updates, { where: { id: lessonId } });

    if (!updated) {
      return res.status(404).json({
        status: 'error',
        message: 'Lección no encontrada',
      });
    }

    const updatedLesson = await Lesson.findByPk(lessonId);

    res.status(200).json({
      status: 'success',
      data: updatedLesson,
    });
  } catch (error) {
    console.error('Error al actualizar la lección:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al actualizar la lección',
    });
  }
};

module.exports = {
  getCourseLessons,
  postLesson,
  deleteLesson,
  updateLesson,
};
