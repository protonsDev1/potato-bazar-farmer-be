"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.changeColumn("governmentSchemes", "mobile", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.changeColumn("governmentSchemes", "email", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.changeColumn("governmentSchemes", "mobile", {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.changeColumn("governmentSchemes", "email", {
        type: Sequelize.STRING,
        allowNull: false,
      }),
    ]);
  },
};
