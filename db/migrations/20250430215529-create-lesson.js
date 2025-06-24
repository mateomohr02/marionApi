"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Lessons", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {
          es: "",
          de: "",
        },
      },
      content: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {
          es: [],
          de: [],
        },
      },
      courseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Courses",
          key: "id",
        },
        onDelete: "CASCADE",
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("Lessons");
  },
};
