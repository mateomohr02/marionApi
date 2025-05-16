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
      name: Sequelize.STRING,
      price: Sequelize.FLOAT,
      description: Sequelize.TEXT,
      content: Sequelize.JSON // Nuevo campo para la clase introductoria gratuita
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Courses');
  }
};
