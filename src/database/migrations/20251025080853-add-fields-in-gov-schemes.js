"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("governmentSchemes", "ageLimit", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("governmentSchemes", "contactUrl", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("governmentSchemes", "ageLimit");
    await queryInterface.removeColumn("governmentSchemes", "contactUrl");
  },
};
