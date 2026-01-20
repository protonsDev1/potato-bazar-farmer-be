"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("seasonWiseBookingSystems", "monthTo", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("seasonWiseBookingSystems", "monthFrom", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("seasonWiseBookingSystems", "monthTo");

    await queryInterface.removeColumn("seasonWiseBookingSystems", "monthFrom");
  },
};
