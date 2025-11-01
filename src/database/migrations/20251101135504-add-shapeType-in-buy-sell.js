"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("buyRequests", "shapeType", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("sellRequests", "shapeType", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("buyRequests", "shapeType");
    await queryInterface.removeColumn("sellRequests", "shapeType");
  },
};
