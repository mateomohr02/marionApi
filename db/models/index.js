'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../config/config.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Cargar todos los modelos
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Ejecutar asociaciones si están definidas en los modelos
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Relaciones manuales
const { user, course, lesson, post, reply } = db;

// user <-> course (muchos a muchos)
user.belongsToMany(course, { through: 'user_courses', foreignKey: 'userId' });
course.belongsToMany(user, { through: 'user_courses', foreignKey: 'courseId' });

// course -> lesson (uno a muchos)
course.hasMany(lesson, { foreignKey: 'courseId', as: 'lessons' });
lesson.belongsTo(course, { foreignKey: 'courseId', as: 'course' });

// user -> post (uno a muchos)
user.hasMany(post, { foreignKey: 'userId', as: 'posts' });
post.belongsTo(user, { foreignKey: 'userId', as: 'author' });

// user -> reply (uno a muchos)
user.hasMany(reply, { foreignKey: 'userId', as: 'replies' });
reply.belongsTo(user, { foreignKey: 'userId', as: 'user' });

// post -> reply (uno a muchos)
post.hasMany(reply, { foreignKey: 'postId', as: 'replies' });
reply.belongsTo(post, { foreignKey: 'postId', as: 'post' });

// reply -> reply (respuestas anidadas)
reply.hasMany(reply, { foreignKey: 'parentId', as: 'replies' });
reply.belongsTo(reply, { foreignKey: 'parentId', as: 'parent' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
