'use strict';

module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: DataTypes.STRING,
    price: DataTypes.FLOAT,
    description: DataTypes.TEXT,
    content: DataTypes.JSON, // contenido de la clase introductoria gratuita
  }, {
    timestamps: false // Desactiva createdAt y updatedAt
  });

  return Course;
};

