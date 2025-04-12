'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Lesson = sequelize.define('lesson', {
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
    type: DataTypes.ARRAY(DataTypes.STRING), // Para múltiples imágenes
    defaultValue: []
  },
  courseId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'courses',
      key: 'id'
    },
    allowNull: false
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
  modelName: 'lesson'
});

module.exports = Lesson;
