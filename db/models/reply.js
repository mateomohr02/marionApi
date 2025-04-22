'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Reply = sequelize.define('reply', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  parentId: {
    type: DataTypes.INTEGER,
    allowNull: true // Puede ser null si es una respuesta directa a un post
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE
  }
}, {
  freezeTableName: true,
  modelName: 'reply'
});

// Relaciones
Reply.associate = (models) => {
  Reply.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });

  Reply.belongsTo(models.Post, {
    foreignKey: 'postId',
    as: 'post'
  });

  Reply.belongsTo(models.Reply, {
    foreignKey: 'parentId',
    as: 'parent'
  });

  Reply.hasMany(models.Reply, {
    foreignKey: 'parentId',
    as: 'replies'
  });
};

module.exports = Reply;
