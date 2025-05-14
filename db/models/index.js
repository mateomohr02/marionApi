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
      file.slice(-3) === '.js'
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Relaciones entre modelos
db.User.hasMany(db.Post, { foreignKey: 'userId', onDelete: 'CASCADE' });
db.Post.belongsTo(db.User, { foreignKey: 'userId' });

db.User.hasMany(db.Reply, { foreignKey: 'userId', onDelete: 'CASCADE'  });
db.Reply.belongsTo(db.User, { foreignKey: 'userId' });

db.Post.hasMany(db.Reply, { foreignKey: 'postId', onDelete: 'CASCADE'  });
db.Reply.belongsTo(db.Post, { foreignKey: 'postId' });

db.Reply.hasMany(db.Reply, { as: 'Replies', foreignKey: 'parentId', onDelete: 'CASCADE'  });
db.Reply.belongsTo(db.Reply, { as: 'Parent', foreignKey: 'parentId' });

db.User.belongsToMany(db.Course, { through: 'UserCourse', foreignKey: 'userId', otherKey: 'courseId' });
db.Course.belongsToMany(db.User, { through: 'UserCourse', foreignKey: 'courseId', otherKey: 'userId' });

db.Course.hasMany(db.Lesson, { foreignKey: 'courseId', onDelete: 'CASCADE' });
db.Lesson.belongsTo(db.Course, { foreignKey: 'courseId' });

db.Course.hasMany(db.Post, { foreignKey: 'courseId', onDelete: 'CASCADE' });
db.Post.belongsTo(db.Course, { foreignKey: 'courseId' });


db.Sequelize = Sequelize;

module.exports = db;
