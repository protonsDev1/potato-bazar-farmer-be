"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("advertisements", "status");

    await queryInterface.addColumn("advertisements", "status", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "open",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("advertisements", "status");

    await queryInterface.addColumn("advertisements", "status", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },
};
