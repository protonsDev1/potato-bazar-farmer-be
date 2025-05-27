'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.dropTable('farmers');
  },

  async down(queryInterface, Sequelize) {
    
  },
};
