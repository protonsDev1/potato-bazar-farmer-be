"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("buyRequests", "dryMatter", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn("sellRequests", "dryMatter", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("buyRequests", "dryMatter", {
      type: Sequelize.FLOAT,
      allowNull: true,
    });

    await queryInterface.changeColumn("sellRequests", "dryMatter", {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
  },
};
