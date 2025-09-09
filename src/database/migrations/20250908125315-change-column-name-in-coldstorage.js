"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.renameColumn("chamberCapacities", "sizePerChamberSqft", "capacityInBags");
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.renameColumn("chamberCapacities", "capacityInBags", "sizePerChamberSqft");
  },
};
