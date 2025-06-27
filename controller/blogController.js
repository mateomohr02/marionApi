const db = require("../db/models");
const { User: User, Reply: Reply, Post: Post } = db;
const slugify = require("../utils/slugify");

// Obtener todas las publicaciones
const getAllPosts = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;

  try {
    const posts = await Post.findAll({
      where: {
        courseId: null, // Solo publicaciones generales
      },
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


// Obtener una publicación por ID
const getPostBySlug = async (req, res) => {
  try {
    const slug = req.params.slug;

    if (!slug) {
      return res.status(400).json({
        status: "error",
        message: "El slug es requerido.",
      });
    }

    const post = await Post.findOne({
      where: {
        slug,
        courseId: null, // Solo publicaciones generales
      },
      include: [
        {
          model: Reply,
          include: [
            {
              model: User,
              attributes: ['name']
            },
            {
              model: Reply,
              as: 'Replies',
              include: [{ model: User, attributes: ['name'] }],
            }
          ]
        },
        {
          model: User,
          attributes: ['id', 'name']
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



// Crear una publicación
const addPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;

    const slug = slugify(title);

    const existing = await Post.findOne({ where: { slug, courseId: null } });
    if (existing) {
      return res.status(409).json({ message: "Ya existe una publicación con ese título." });
    }

    const newPost = await Post.create({
      title,
      slug,
      content,
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


// Editar una publicación
const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await Post.findOne({ where: { id: postId, userId } });

    if (!post) {
      return res.status(404).json({
        status: "error",
        message: "Publicación no encontrada o no autorizada",
      });
    }

    const { title, content } = req.body;

    post.title = title ?? post.title;
    post.content = content ?? post.content;

    await post.save();

    return res.status(200).json({
      status: "success",
      data: post,
    });
  } catch (error) {
    console.error("Error al actualizar la publicación:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al actualizar la publicación",
    });
  }
};

// Eliminar una publicación
const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await Post.findOne({ where: { id: postId, userId } });

    if (!post) {
      return res.status(404).json({
        status: "error",
        message: "Publicación no encontrada o no autorizada",
      });
    }

    await post.destroy();

    return res.status(200).json({
      status: "success",
      message: "Publicación eliminada correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar la publicación:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al eliminar la publicación",
    });
  }
};

// Añadir un comentario
const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const author = req.user.id;
    const { content, parentId } = req.body;

    console.log(postId, author, content, parentId, 'ESTO RECIBE EL CONTROLLER');

    const response = await Reply.create({
      postId,
      userId: author,
      content,
      parentId,
    });

    if (!response) {
      return res.status(400).json({
        status: "error",
        message: "Algo sucedió al querer añadir el comentario.",
      });
    }

    // Buscar el comentario recién creado incluyendo el autor y posibles respuestas hijas
    const newReply = await Reply.findByPk(response.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
        {
          model: Reply,
          as: 'Replies', // alias definido en las asociaciones
          include: [{ model: User, attributes: ['name'] }],
        },
      ],
    });

    res.status(200).json({
      status: "success",
      data: newReply,
    });
  } catch (error) {
    console.error("Error al añadir el comentario:", error);
    res.status(400).json({
      status: "error",
      message: `Error al añadir el comentario, ${error.message}`,
    });
  }
};


module.exports = {
  getAllPosts,
  getPostBySlug,
  addPost,
  updatePost,
  deletePost,
  addComment,
};
