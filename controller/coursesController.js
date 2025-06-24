const db = require("../db/models");
const { Course, User, Reply, Post } = db;
const { Op, fn, col, where, literal, json } = require("sequelize");

const getUserCourses = async (req, res) => {
  const { id } = req.user;

  try {
    const foundUser = await User.findByPk(id, {
      include: {
        model: Course,
        through: { attributes: [] },
        as: "Courses",
      },
    });

    if (!foundUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(foundUser.Courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener cursos del usuario" });
  }
};

const getCourseByName = async (req, res) => {
  try {
    const courseName = req.query.name;
    const lang = req.query.lang || "es"; // por defecto en español

    if (!courseName) {
      return res.status(400).json({ message: "El nombre del curso es requerido" });
    }

    const course = await Course.findOne({
      where: where(
        fn("LOWER", json(`name.${lang}`)),
        courseName.toLowerCase()
      ),
    });

    if (!course) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    return res.status(200).json({ course });
  } catch (error) {
    console.error("Error al obtener el curso:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
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
  const userId = req.user.id;
  const body = req.body;

  try {
    const newCourse = await Course.create({
      name: body.name, // { es: "", de: "" }
      price: body.price, // { ars: 0, eur: 0 }
      description: body.description, // { es: "", de: "" }
      poster: body.poster, // { es: "", de: "" }
      content: body.content, // { es: [], de: [] }
    });

    const result = newCourse.toJSON();

    if (!result) {
      return res.status(400).json({
        status: "error",
        message: "Fallo al crear el curso",
      });
    }

    const course = await Course.findByPk(result.id);
    const admins = await User.findAll({ where: { userType: '0' } });

    await Promise.all(admins.map((admin) => admin.addCourse(course)));

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

  try {
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await user.addCourse(course);
    res.status(200).json({ message: "Usuario añadido al curso exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al añadir usuario al curso" });
  }
};

const addPostToCourseForum = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.user.id;

    const newPost = await Post.create({
      title,
      content,
      courseId: id,
      userId,
    });

    return res.status(201).json({
      status: "success",
      data: newPost,
    });
  } catch (error) {
    console.error("Error al crear la publicación:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al crear la publicación",
    });
  }
};

const getCourseForumPosts = async (req, res) => {
  const { id } = req.params;
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;

  try {
    const posts = await Post.findAll({
      where: {
        courseId: id,
      },
      include: [
        {
          model: User,
          attributes: ["id", "name"],
        },
      ],
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      status: "success",
      data: posts,
    });
  } catch (error) {
    console.error("Error al obtener las publicaciones:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al obtener publicaciones.",
    });
  }
};

const getForumPostDetail = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findByPk(postId, {
      include: [
        {
          model: User,
          attributes: ["id", "name"],
        },
        {
          model: Reply,
          include: [
            {
              model: User,
              attributes: ['name'],
            },
            {
              model: Reply,
              as: 'Replies',
              include: [{ model: User, attributes: ['name'] }],
            }
          ]
        }
      ]
    });

    if (!post) {
      return res.status(404).json({
        status: "error",
        message: "Publicación no encontrada",
      });
    }

    return res.status(200).json({
      status: "success",
      data: post,
    });
  } catch (error) {
    console.error("Error al obtener la publicación:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al obtener la publicación",
    });
  }
};

module.exports = {
  getCourses,
  getCourseByName,
  addCourse,
  getUserCourses,
  addUserToCourse,
  addPostToCourseForum,
  getCourseForumPosts,
  getForumPostDetail,
};
