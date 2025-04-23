const Post = require('../db/models/post');

const getAllPosts = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;

  try {
    const Posts = await Post.findAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      status: 'success',
      data: Posts
    });
  } catch (error) {
    console.error('Error al obtener las publicaciones:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error al obtener publicaciones.'
    });
  }
};


// Crear una publicación
const addPost = async (req, res) => {
  try {
    const { title, content, videoUrl, imageUrls } = req.body;
    const userId = req.user.id;

    const newPost = await Post.create({
      title,
      content,
      videoUrl,
      imageUrls,
      userId
    });

    return res.status(201).json({
      status: 'success',
      data: newPost
    });
  } catch (error) {
    console.error('Error al crear la publicación:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error al crear la publicación'
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
        status: 'error',
        message: 'Publicación no encontrada o no autorizada'
      });
    }

    const { title, content, videoUrl, imageUrls } = req.body;

    post.title = title ?? post.title;
    post.content = content ?? post.content;
    post.videoUrl = videoUrl ?? post.videoUrl;
    post.imageUrls = imageUrls ?? post.imageUrls;

    await post.save();

    return res.status(200).json({
      status: 'success',
      data: post
    });
  } catch (error) {
    console.error('Error al actualizar la publicación:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error al actualizar la publicación'
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
        status: 'error',
        message: 'Publicación no encontrada o no autorizada'
      });
    }

    await post.destroy();

    return res.status(200).json({
      status: 'success',
      message: 'Publicación eliminada correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar la publicación:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error al eliminar la publicación'
    });
  }
};

module.exports = {
  getAllPosts,
  addPost,
  updatePost,
  deletePost
};
