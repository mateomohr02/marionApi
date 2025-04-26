'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('post', 'content', {
      type: Sequelize.JSONB,
      allowNull: false,
      defaultValue: []
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('post', 'content', {
      type: Sequelize.ARRAY(Sequelize.JSONB),
      allowNull: false,
      defaultValue: []
    });
  }
};

