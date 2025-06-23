"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn("users", "lastLogin", {
        type: Sequelize.DATE,
        allowNull: true,
      }),
      queryInterface.addColumn("users", "passwordUpdatedAt", {
        type: Sequelize.DATE,
        allowNull: true,
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn("users", "lastLogin"),
      queryInterface.removeColumn("users", "passwordUpdatedAt"),
    ]);
  },
};
