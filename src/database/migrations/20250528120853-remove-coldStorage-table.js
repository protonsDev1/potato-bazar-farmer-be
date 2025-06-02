'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.dropTable('cold_storages');
  },

  async down(queryInterface, Sequelize) {
    
  },
};
