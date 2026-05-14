"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = "liveAuctions";

    // 🔹 String fields
    await queryInterface.addColumn(table, "shape", { type: Sequelize.STRING });
    await queryInterface.addColumn(table, "skinColor", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn(table, "tuberSize", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn(table, "dryMatter", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn(table, "healthCondition", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn(table, "additionalComment", {
      type: Sequelize.TEXT,
    });
    await queryInterface.addColumn(table, "storageTemperature", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn(table, "brand", { type: Sequelize.STRING });
    await queryInterface.addColumn(table, "generation", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn(table, "treatmentStatus", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn(table, "seedSourceType", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn(table, "sproutingCondition", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn(table, "physicalCondition", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn(table, "roguingStatus", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn(table, "productionMethod", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn(table, "reason", { type: Sequelize.STRING });
    await queryInterface.addColumn(table, "shapeType", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn(table, "perTubeWeight", {
      type: Sequelize.STRING,
    });

    // 🔹 Float fields
    await queryInterface.addColumn(table, "tpod", { type: Sequelize.FLOAT });
    await queryInterface.addColumn(table, "uc", { type: Sequelize.FLOAT });

    // 🔹 Date
    await queryInterface.addColumn(table, "productionDate", {
      type: Sequelize.DATE,
    });

    // 🔹 Boolean
    await queryInterface.addColumn(table, "diseaseFreeCertified", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },

  async down(queryInterface) {
    const table = "liveAuctions";

    await queryInterface.removeColumn(table, "shape");
    await queryInterface.removeColumn(table, "skinColor");
    await queryInterface.removeColumn(table, "tuberSize");
    await queryInterface.removeColumn(table, "dryMatter");
    await queryInterface.removeColumn(table, "healthCondition");
    await queryInterface.removeColumn(table, "additionalComment");
    await queryInterface.removeColumn(table, "storageTemperature");
    await queryInterface.removeColumn(table, "brand");
    await queryInterface.removeColumn(table, "generation");
    await queryInterface.removeColumn(table, "treatmentStatus");
    await queryInterface.removeColumn(table, "seedSourceType");
    await queryInterface.removeColumn(table, "sproutingCondition");
    await queryInterface.removeColumn(table, "physicalCondition");
    await queryInterface.removeColumn(table, "roguingStatus");
    await queryInterface.removeColumn(table, "productionMethod");
    await queryInterface.removeColumn(table, "reason");
    await queryInterface.removeColumn(table, "shapeType");
    await queryInterface.removeColumn(table, "perTubeWeight");

    await queryInterface.removeColumn(table, "tpod");
    await queryInterface.removeColumn(table, "uc");

    await queryInterface.removeColumn(table, "productionDate");
    await queryInterface.removeColumn(table, "diseaseFreeCertified");
  },
};
