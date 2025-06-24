'use strict';

module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      allowNull: false,
      type: DataTypes.JSON // { es: "", de: "" }
    },
    price: {
      allowNull: false,
      type: DataTypes.JSON // { ars: 0, eur: 0 }
    },
    description: {
      allowNull: false,
      type: DataTypes.JSON // { es: "", de: "" }
    },
    poster: {
      allowNull: false,
      type: DataTypes.JSON // { es: "", de: "" }
    },
    content: {
      allowNull: false,
      type: DataTypes.JSON // { es: [], de: [] }
    }
  }, {
    timestamps: false
  });

  return Course;
};
