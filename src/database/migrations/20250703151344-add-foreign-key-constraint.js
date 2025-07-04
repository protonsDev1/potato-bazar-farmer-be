"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // ChamberCapacity
    await queryInterface.removeColumn("chamberCapacities", "coldStorageId");

    await queryInterface.addColumn("chamberCapacities", "coldStorageId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "coldStorages",
        key: "id",
      },
      onDelete: "CASCADE",
    });

    //UsageType
    await queryInterface.removeColumn("usageTypes", "coldStorageId");

    await queryInterface.addColumn("usageTypes", "coldStorageId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "coldStorages",
        key: "id",
      },
      onDelete: "CASCADE",
    });

    // Shed
    await queryInterface.removeColumn("sheds", "coldStorageId");

    await queryInterface.addColumn("sheds", "coldStorageId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "coldStorages",
        key: "id",
      },
      onDelete: "CASCADE",
    });

    // OperationalChallenge
    await queryInterface.removeColumn("operationalChallenges", "coldStorageId");

    await queryInterface.addColumn("operationalChallenges", "coldStorageId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "coldStorages",
        key: "id",
      },
      onDelete: "CASCADE",
    });
  },

  down: async (queryInterface, Sequelize) => {
    // ChamberCapacity
    await queryInterface.removeColumn("chamberCapacities", "coldStorageId");

    await queryInterface.addColumn("chamberCapacities", "coldStorageId", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    // UsageType
    await queryInterface.removeColumn("usageTypes", "coldStorageId");

    await queryInterface.addColumn("usageTypes", "coldStorageId", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    //Shed
    await queryInterface.removeColumn("sheds", "coldStorageId");

    await queryInterface.addColumn("sheds", "coldStorageId", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    //OperationalChallenge
    await queryInterface.removeColumn("operationalChallenges", "coldStorageId");

    await queryInterface.addColumn("operationalChallenges", "coldStorageId", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },
};
