"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "pbVerified", {
      type: Sequelize.BOOLEAN,
      default: false,
    });

    await queryInterface.addColumn("users", "pbVerificationStatus", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("users", "pbVerificationRequested", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });

    await queryInterface.addColumn("users", "pbVerificationRequestedAt", {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("users", "pbVerified");
    await queryInterface.removeColumn("users", "pbVerificationStatus");
    await queryInterface.removeColumn("users", "pbVerificationRequested");
    await queryInterface.removeColumn("users", "pbVerificationRequestedAt");
  },
};
