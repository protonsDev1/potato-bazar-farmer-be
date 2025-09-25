"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("coldStorageRequirements", "commodityType", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("coldStorageRequirements", "storageTypes", {
      type: Sequelize.ARRAY(Sequelize.STRING),
    });
    await queryInterface.addColumn("coldStorageRequirements", "bagTypes", {
      type: Sequelize.ARRAY(Sequelize.STRING),
    });
    await queryInterface.removeColumn("coldStorageRequirements", "capacityMin");
    await queryInterface.removeColumn("coldStorageRequirements", "capacityMax");
    await queryInterface.removeColumn("coldStorageRequirements", "storageType");
    await queryInterface.removeColumn(
      "coldStorageRequirements",
      "contactNumber"
    );
    await queryInterface.removeColumn("coldStorageRequirements", "email");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      "coldStorageRequirements",
      "commodityType"
    );
    await queryInterface.removeColumn(
      "coldStorageRequirements",
      "storageTypes"
    );
    await queryInterface.removeColumn("coldStorageRequirements", "bagTypes");
    await queryInterface.addColumn("coldStorageRequirements", "capacityMin", {
      type: Sequelize.INTEGER,
    });
    await queryInterface.addColumn("coldStorageRequirements", "capacityMax", {
      type: Sequelize.INTEGER,
    });
    await queryInterface.addColumn("coldStorageRequirements", "storageType", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("coldStorageRequirements", "contactNumber", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("coldStorageRequirements", "email", {
      type: Sequelize.STRING,
    });
  },
};
