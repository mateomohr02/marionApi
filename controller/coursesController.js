const db = require("../db/models");
const { Course: Course, User: User } = db;

const getUserCourses = async (req, res) => {
  const { id } = req.user;

  try {
    const foundUser = await User.findByPk(id, {
      include: {
        model: Course,
        through: { attributes: [] }, // Oculta la tabla intermedia
        as: "Courses", // Asegurate de que este alias coincide con tu relación en models/index.js
      },
    });

    if (!foundUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(foundUser.Courses); // O "foundUser.get('Courses')" si querés más flexibilidad
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener cursos del usuario" });
  }
};

const getCourses = async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.status(200).json(courses);
  } catch (error) {
    console.error("Error al obtener los cursos:", error);
    res.status(500).json({ message: "Error al obtener los cursos" });
  }
};

const addCourse = async (req, res) => {
  const body = req.body;

  try {
    const newCourse = await Course.create({
      name: body.name,
      price: body.price,
      description: body.description,
      introVideoUrl: body.introVideoUrl,
    });

    const result = newCourse.toJSON();

    if (!result) {
      return res.status(400).json({
        status: "error",
        message: "Fail to create the course",
      });
    }

    return res.status(201).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    console.error("Error al crear el curso:", error);
    res.status(500).json({
      status: "error",
      message: "Error al crear el curso",
    });
  }
};

const addUserToCourse = async (req, res) => {
  const userId = req.user.id;
  const courseId = req.params.id;

  console.log(req.user, 'REQ.USER');
  console.log(req.params, 'REQ PARAMS');
  
  

  try {
    // Verificar que el curso exista
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    // Obtener el usuario
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Asociar el usuario al curso
    await user.addCourse(course); // Sequelize crea este método automáticamente

    res.status(200).json({ message: "Usuario añadido al curso exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al añadir usuario al curso" });
  }
};

module.exports = { getCourses, addCourse, getUserCourses, addUserToCourse };
