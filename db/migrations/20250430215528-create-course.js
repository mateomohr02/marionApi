'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Courses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.JSON
      },
      slug: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      price: {
        allowNull: false,
        type: Sequelize.JSON
      },
      description: {
        allowNull: false,
        type: Sequelize.JSON
      },
      poster: {
        allowNull: false,
        type: Sequelize.JSON
      },
      content: {
        allowNull: false,
        type: Sequelize.JSON
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Courses');
  }
};
