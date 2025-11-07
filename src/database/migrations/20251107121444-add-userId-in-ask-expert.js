"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("askExperts", "userId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    });

    await queryInterface.removeColumn("askExperts", "cropDiagnosedId");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("askExperts", "userId");
    await queryInterface.addColumn("askExperts", "cropDiagnosedId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "cropDiagnoses",
        key: "id",
      },
      onDelete: "CASCADE",
    });
  },
};
