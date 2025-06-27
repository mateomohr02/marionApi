const db = require("../db/models");
const { Course, User, Reply, Post } = db;
const slugify = require("../utils/slugify");

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

  console.log('arrives controller');
  

  try {
    // Ahora el parámetro "name" realmente es el slug
    const courseSlug = req.query.name;    

    if (!courseSlug) {
      return res
        .status(400)
        .json({ message: "El slug del curso es requerido" });
    }
    
    const course = await Course.findOne({
      where: { slug: courseSlug },
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
    // Se genera slug desde el nombre en español
    const slug = slugify(body.name.es);

    // Validar que no exista otro curso con el mismo slug
    const slugExists = await Course.findOne({ where: { slug } });
    if (slugExists) {
      return res.status(409).json({
        message: "Ya existe un curso con ese nombre (slug duplicado).",
      });
    }

    const newCourse = await Course.create({
      name: body.name,
      slug,
      price: body.price,
      description: body.description,
      poster: body.poster,
      content: body.content,
    });

    const result = newCourse.toJSON();

    const course = await Course.findByPk(result.id);
    const admins = await User.findAll({ where: { userType: "0" } });

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
    const { courseName } = req.params;
    const { title, content } = req.body;
    const userId = req.user.id;

    if (!courseName || !title || !content) {
      return res.status(400).json({ message: "Faltan campos requeridos." });
    }

    // Aquí courseName es el slug del curso
    const course = await Course.findOne({ where: { slug: courseName } });

    if (!course) {
      return res.status(404).json({ message: "Curso no encontrado." });
    }

    const slug = slugify(title);

    const existing = await Post.findOne({
      where: { slug, courseId: course.id },
    });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Ya existe una publicación con ese título." });
    }

    const newPost = await Post.create({
      title,
      slug,
      content,
      courseId: course.id,
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
  let { courseName } = req.params;
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;

  try {
    if (!courseName) {
      return res.status(400).json({ message: "El slug del curso es requerido." });
    }

    courseName = courseName.split(" courseName")[0].trim();

    // Aquí courseName es slug
    const course = await Course.findOne({ where: { slug: courseName } });

    if (!course) {
      return res.status(404).json({ message: "Curso no encontrado." });
    }

    const posts = await Post.findAll({
      where: {
        courseId: course.id,
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
    console.error("Error al obtener las publicaciones del foro:", error);
    return res.status(500).json({
      status: "error",
      message: "Error interno al obtener publicaciones del foro.",
    });
  }
};

const getForumPostDetail = async (req, res) => {
  try {
    const { postName, courseName } = req.params;

    if (!courseName || !postName) {
      return res.status(400).json({ message: "Faltan parámetros requeridos." });
    }

    const formattedPostSlug = slugify(postName);

    // courseName es slug
    const course = await Course.findOne({ where: { slug: courseName } });

    if (!course) {
      return res.status(404).json({ message: "Curso no encontrado." });
    }

    const post = await Post.findOne({
      where: {
        courseId: course.id,
        slug: formattedPostSlug,
      },
      include: [
        {
          model: User,
          attributes: ["id", "name"],
        },
        {
          model: Reply,
          include: [
            { model: User, attributes: ["name"] },
            {
              model: Reply,
              as: "Replies",
              include: [{ model: User, attributes: ["name"] }],
            },
          ],
        },
      ],
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
