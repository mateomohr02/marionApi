const db = require("../db/models");
const { User: User, Reply: Reply, Post: Post } = db;

// Obtener todas las publicaciones
const getAllPosts = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;

  try {
    const posts = await Post.findAll({
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
const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await Post.findByPk(postId, {
      include: [
        {
          model: Reply,
          include: [
            {
              model: User, // opcional: incluir el usuario que escribió la respuesta
              attributes: ['name'] // o los campos que quieras exponer
            },
            {
              model: Reply, // incluir respuestas anidadas
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


// Crear una publicación
const addPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;

    const newPost = await Post.create({
      title,
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

    const response = await Reply.create({
      postId,
      userId: author,
      content,
      parentId,
    });

    if (!response) {
      return res.status(300).json({
        status: "error",
        message: "Algo sucedió al querer añadir el comentario.",
      });
    }

    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: `Error al añadir el comentario, ${error.message}`,
    });
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  addPost,
  updatePost,
  deletePost,
  addComment,
};
