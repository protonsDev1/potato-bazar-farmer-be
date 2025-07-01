"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Rename column
    await queryInterface.renameColumn(
      "LandDetails",
      "potatoCultivationAcres",
      "totalLandUnderCultivation"
    );

    // Add new column
    await queryInterface.addColumn("LandDetails", "landForPotatoFarming", {
      type: Sequelize.FLOAT,
      allowNull: true,
    });

    await queryInterface.addColumn("LandDetails", "irrigationEquipmentModel", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("LandDetails", "seedProcurementType", {
      type: Sequelize.ENUM("new", "reused", "both"),
      allowNull: true,
    });

    await queryInterface.addColumn("LandDetails", "newSeedPercent", {
      type: Sequelize.FLOAT,
      allowNull: true,
    });

    await queryInterface.addColumn("LandDetails", "reusedSeedPercent", {
      type: Sequelize.FLOAT,
      allowNull: true,
    });

    await queryInterface.addColumn("LandDetails", "seedBrandName", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Remove the column
    await queryInterface.removeColumn(
      "LandDetails",
      "newSeedsPurchasedAnnually"
    );
    await queryInterface.removeColumn("LandDetails", "reusedSeedsPercent");
    await queryInterface.removeColumn("LandDetails", "trustedSeedCompany");
  },

  down: async (queryInterface, Sequelize) => {
    // Revert the rename
    await queryInterface.renameColumn(
      "LandDetails",
      "totalLandUnderCultivation",
      "potatoCultivationAcres"
    );

    // Remove the new column
    await queryInterface.removeColumn(
      "LandDetails",
      "irrigationEquipmentModel"
    );
    await queryInterface.removeColumn("LandDetails", "landForPotatoFarming");
    await queryInterface.removeColumn("LandDetails", "seedBrandName");
    await queryInterface.removeColumn("LandDetails", "seedProcurementType");
    await queryInterface.removeColumn("LandDetails", "newSeedPercent");
    await queryInterface.removeColumn("LandDetails", "reusedSeedPercent");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_LandDetails_seedProcurementType";'
    );

    // Add the new column
    await queryInterface.addColumn("LandDetails", "newSeedsPurchasedAnnually", {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });

    await queryInterface.addColumn("LandDetails", "reusedSeedsPercent", {
      type: Sequelize.FLOAT,
      allowNull: true,
    });

    await queryInterface.addColumn("LandDetails", "trustedSeedCompany", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
