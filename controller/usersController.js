const db = require("../db/models");
const { User, Course, Post, Reply } = db;

const getAllUsers = async (req, res) => {
  const { page = 1 } = req.query;
  const limit = 10;
  const offset = (page - 1) * limit;

  try {
    const { count, rows: users } = await User.findAndCountAll({
      attributes: ['id','email', 'name'],
      include: [
        {
          model: Course,
          attributes: ['id', 'name'], // Puedes agregar más si querés
          through: { attributes: [] } // Oculta UserCourse
        },
      ],
      limit,
      offset,
    });

    return res.status(200).json({
      status: "success",
      data: users,
      pagination: {
        totalUsers: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
      },
    });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return res.status(500).json({
      status: "failure",
      message: "Error al obtener los usuarios",
    });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        status: "failure",
        message: "Usuario no encontrado",
      });
    }

    await user.destroy();

    return res.status(200).json({
      status: "success",
      message: "Usuario eliminado correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    return res.status(500).json({
      status: "failure",
      message: "Error al eliminar el usuario",
    });
  }
};

const getUserActivity = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id, {
      attributes: ['id', 'name', 'email'],
      include: [
        {
          model: Post,
          attributes: ['id', 'title', 'content', 'courseId', 'createdAt'],
        },
        {
          model: Reply,
          attributes: ['id', 'content', 'postId', 'createdAt'],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        status: "failure",
        message: "Usuario no encontrado",
      });
    }

    return res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    console.error("Error al obtener actividad del usuario:", error);
    return res.status(500).json({
      status: "failure",
      message: "Error al obtener la actividad del usuario",
    });
  }
};


module.exports = {
  getAllUsers,
  deleteUser,
  getUserActivity,
};

