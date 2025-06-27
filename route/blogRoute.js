const { authentication, restrictTo } = require('../controller/authController.js');
const {
  addPost,
  updatePost,
  deletePost,
  getAllPosts,
  getPostBySlug,
  addComment
} = require('../controller/blogController.js');

const router = require('express').Router();

// Obtener todas las publicaciones
router.get('/get-all-posts', getAllPosts);

// Obtener una sola publicación por ID
router.get('/get-post/:slug', getPostBySlug);

// Crear una publicación (requiere estar autenticado)
router.post('/add-post', authentication, restrictTo('0'), addPost);

// Modificar una publicación (requiere estar autenticado y ser el dueño)
router.put('/update-post/:id', authentication, restrictTo('0'), updatePost);

//Añadir comentario
router.post('/add-comment/:id', authentication, addComment);

// Eliminar una publicación (requiere estar autenticado y ser el dueño)
router.delete('/delete-post/:id', authentication, deletePost);

module.exports = router;
