"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("coldStorages", "gradingCharges", {
      type: Sequelize.DECIMAL,
      allowNull: true,
    });

    await queryInterface.addColumn("coldStorages", "otherCharges", {
      type: Sequelize.DECIMAL,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("coldStorages", "gradingCharges");
    await queryInterface.removeColumn("coldStorages", "otherCharges");
  },
};
