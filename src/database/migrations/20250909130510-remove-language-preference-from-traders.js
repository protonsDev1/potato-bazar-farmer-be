"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("traders", "languagePreference", {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("traders", "languagePreference", {
      type: Sequelize.STRING(50),
      allowNull: false,
    });
  },
};
