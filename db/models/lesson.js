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
      title: DataTypes.STRING,
      content: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: []
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
