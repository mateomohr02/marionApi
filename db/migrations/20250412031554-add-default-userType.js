'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('user', 'userType', {
      type: Sequelize.ENUM('0', '1'),
      defaultValue: '1',
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('user', 'userType', {
      type: Sequelize.ENUM('0', '1'),
      allowNull: true,
      defaultValue: null
    });
  }
};

