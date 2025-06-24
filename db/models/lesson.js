"use strict";

module.exports = (sequelize, DataTypes) => {
  const Lesson = sequelize.define(
  "Lesson",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    title: {
      type: DataTypes.JSONB, // Antes era STRING, ahora soporta 'es' y 'de'
      allowNull: false,
      defaultValue: {
        es: "",
        de: ""
      }
    },
    content: {
      type: DataTypes.JSONB, // Antes era un solo array, ahora soporta ambos idiomas
      allowNull: false,
      defaultValue: {
        es: [],
        de: []
      }
    },
    courseId: {
      type: DataTypes.INTEGER,
      references: {
        model: "courses",
        key: "id",
      },
      allowNull: false,
    }
  },
  {
    timestamps: false
  }
);
  return Lesson;
};
