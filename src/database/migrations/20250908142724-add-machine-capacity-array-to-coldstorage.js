"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("coldStorages", "machineCapacityArray", {
      type: Sequelize.ARRAY(Sequelize.DECIMAL),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("coldStorages", "machineCapacityArray");
  },
};
