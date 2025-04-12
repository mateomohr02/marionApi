'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Course = sequelize.define('course', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  name: DataTypes.STRING,
  price: DataTypes.FLOAT,
  description: DataTypes.TEXT,
  introVideoUrl: DataTypes.STRING,
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
  modelName: 'course'
});

module.exports = Course;
