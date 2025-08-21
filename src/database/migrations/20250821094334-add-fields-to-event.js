"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("events", "category", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("events", "state", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("events", "district", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("events", "category");

    await queryInterface.removeColumn("events", "state");

    await queryInterface.removeColumn("events", "district");
  },
};
