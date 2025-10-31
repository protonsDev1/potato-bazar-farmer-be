"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("buyRequests", "size", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn("sellRequests", "size", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("buyRequests", "size", {
      type: Sequelize.FLOAT,
      allowNull: true,
    });

    await queryInterface.changeColumn("sellRequests", "size", {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
  },
};
