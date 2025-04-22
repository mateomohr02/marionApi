'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Post = sequelize.define('post', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  title: DataTypes.STRING,
  content: DataTypes.TEXT,
  videoUrl: DataTypes.STRING,
  imageUrls: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'user',
      key: 'id'
    }
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
  modelName: 'post'
});

// Relaciones
Post.associate = (models) => {
  Post.hasMany(models.Reply, {
    foreignKey: 'postId',
    as: 'replies'
  });
};

module.exports = Post;
