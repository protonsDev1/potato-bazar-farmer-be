"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn("agents", "is_active", "isActive");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn("agents", "isActive", "is_active");
  },
};
