'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const User = sequelize.define('user', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  userType: {
    type: DataTypes.ENUM('0', '1'), // 0 = admin, 1 = user
    defaultValue: '1'
  },
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
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
  modelName: 'user'
});

// Relaciones
User.associate = (models) => {
  User.hasMany(models.Reply, {
    foreignKey: 'userId',
    as: 'replies'
  });
};

module.exports = User;
