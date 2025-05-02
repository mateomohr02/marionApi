const db = require('../db/models');
const { Course: Course, User: User } = db;

const getUserCourses = async (req, res) => {
  const { userId } = req.body;

  try {
    const foundUser = await User.findByPk(userId, {
      include: {
        model: Course,
        through: { attributes: [] } // Oculta la tabla intermedia
      }
    });

    if (!foundUser) return res.status(404).json({ message: 'Usuario no encontrado' });

    res.json(foundUser.courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener cursos del usuario' });
  }
};

const getCourses = async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error al obtener los cursos:', error);
    res.status(500).json({ message: 'Error al obtener los cursos' });
  }
};

const addCourse = async (req, res) => {
  const body = req.body;

  try {
    const newCourse = await Course.create({
      name: body.name,
      price: body.price,
      description: body.description,
      introVideoUrl: body.introVideoUrl
    });

    const result = newCourse.toJSON();

    if (!result) {
      return res.status(400).json({
        status: 'error',
        message: 'Fail to create the course'
      });
    }

    return res.status(201).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    console.error('Error al crear el curso:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al crear el curso'
    });
  }
};

module.exports = { getCourses, addCourse, getUserCourses };
