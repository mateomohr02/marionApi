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
      content: DataTypes.TEXT,
      videoUrl: DataTypes.STRING,
      imageUrls: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
      },
      courseId: {
        type: DataTypes.INTEGER,
        references: {
          model: "courses",
          key: "id",
        },
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      freezeTableName: true,
      modelName: "lesson",
    }
  );
  return Lesson;
};
