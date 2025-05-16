'use strict';

module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name:{
      allowNull: false,
      type: DataTypes.STRING
    },
    price:{
      allowNull: false,
      type: DataTypes.FLOAT
    },
    description:{
      allowNull: false,
      type: DataTypes.TEXT
    },
    poster:{
      allowNull: false,
      type: DataTypes.TEXT
    },
    content:{
      allowNull: false,
      type: DataTypes.JSON
    }, // contenido de la clase introductoria gratuita
  }, {
    timestamps: false // Desactiva createdAt y updatedAt
  });

  return Course;
};

