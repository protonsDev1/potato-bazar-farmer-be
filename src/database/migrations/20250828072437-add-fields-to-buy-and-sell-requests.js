"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn(
      "sellRequests",
      "organicCerified",
      "organicCertified"
    );
    await queryInterface.renameColumn(
      "buyRequests",
      "organicCerified",
      "organicCertified"
    );

    await queryInterface.removeColumn("sellRequests", "requiredByDate");

    await queryInterface.changeColumn("buyRequests", "qualityGrade", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn("sellRequests", "qualityGrade", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("buyRequests", "additionalComment", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn("buyRequests", "isAdminVerified", {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    });

    await queryInterface.addColumn("buyRequests", "isActive", {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    });

    await queryInterface.addColumn("buyRequests", "skinColor", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("buyRequests", "tuberSize", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("buyRequests", "healthCondition", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("buyRequests", "storageTemperature", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("buyRequests", "brand", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("buyRequests", "generation", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("buyRequests", "treatmentStatus", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("buyRequests", "seedSourceType", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("buyRequests", "sproutingCondition", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("buyRequests", "physicalCondition", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("buyRequests", "roguingStatus", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("buyRequests", "perTubeWeight", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("buyRequests", "diseaseFreeCertified", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("buyRequests", "productionMethod", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("buyRequests", "productionDate", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn("buyRequests", "tpod", {
      type: Sequelize.FLOAT,
      allowNull: true,
    });

    await queryInterface.addColumn("buyRequests", "uc", {
      type: Sequelize.FLOAT,
      allowNull: true,
    });

    await queryInterface.addColumn("buyRequests", "dryMatter", {
      type: Sequelize.FLOAT,
      allowNull: true,
    });

    await queryInterface.addColumn("sellRequests", "minOrderQuantity", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("sellRequests", "images", {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
    });

    await queryInterface.addColumn("sellRequests", "location", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("sellRequests", "additionalComment", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn("sellRequests", "isAdminVerified", {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    });

    await queryInterface.addColumn("sellRequests", "isActive", {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    });

    await queryInterface.addColumn("sellRequests", "skinColor", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("sellRequests", "tuberSize", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("sellRequests", "healthCondition", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("sellRequests", "storageTemperature", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("sellRequests", "brand", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("sellRequests", "generation", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("sellRequests", "treatmentStatus", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("sellRequests", "seedSourceType", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("sellRequests", "sproutingCondition", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("sellRequests", "physicalCondition", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("sellRequests", "roguingStatus", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("sellRequests", "perTubeWeight", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("sellRequests", "diseaseFreeCertified", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("sellRequests", "productionMethod", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("sellRequests", "productionDate", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn("sellRequests", "tpod", {
      type: Sequelize.FLOAT,
      allowNull: true,
    });

    await queryInterface.addColumn("sellRequests", "uc", {
      type: Sequelize.FLOAT,
      allowNull: true,
    });

    await queryInterface.addColumn("sellRequests", "dryMatter", {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn(
      "sellRequests",
      "organicCertified",
      "organicCerified"
    );
    await queryInterface.renameColumn(
      "buyRequests",
      "organicCertified",
      "organicCerified"
    );
    await queryInterface.addColumn("sellRequests", "requiredByDate", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.changeColumn("buyRequests", "qualityGrade", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn("sellRequests", "qualityGrade", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.removeColumn("buyRequests", "isAdminVerified");
    await queryInterface.removeColumn("buyRequests", "isActive");
    await queryInterface.removeColumn("buyRequests", "additionalComment");
    await queryInterface.removeColumn("buyRequests", "skinColor");
    await queryInterface.removeColumn("buyRequests", "tuberSize");
    await queryInterface.removeColumn("buyRequests", "healthCondition");
    await queryInterface.removeColumn("buyRequests", "storageTemperature");
    await queryInterface.removeColumn("buyRequests", "brand");
    await queryInterface.removeColumn("buyRequests", "generation");
    await queryInterface.removeColumn("buyRequests", "treatmentStatus");
    await queryInterface.removeColumn("buyRequests", "seedSourceType");
    await queryInterface.removeColumn("buyRequests", "sproutingCondition");
    await queryInterface.removeColumn("buyRequests", "physicalCondition");
    await queryInterface.removeColumn("buyRequests", "roguingStatus");
    await queryInterface.removeColumn("buyRequests", "perTubeWeight");
    await queryInterface.removeColumn("buyRequests", "diseaseFreeCertified");
    await queryInterface.removeColumn("buyRequests", "productionMethod");
    await queryInterface.removeColumn("buyRequests", "productionDate");
    await queryInterface.removeColumn("buyRequests", "tpod");
    await queryInterface.removeColumn("buyRequests", "uc");
    await queryInterface.removeColumn("buyRequests", "dryMatter");
    await queryInterface.removeColumn("sellRequests", "images");
    await queryInterface.removeColumn("sellRequests", "location");
    await queryInterface.removeColumn("sellRequests", "minOrderQuantity");
    await queryInterface.removeColumn("sellRequests", "isAdminVerified");
    await queryInterface.removeColumn("sellRequests", "isActive");
    await queryInterface.removeColumn("sellRequests", "additionalComment");
    await queryInterface.removeColumn("sellRequests", "skinColor");
    await queryInterface.removeColumn("sellRequests", "tuberSize");
    await queryInterface.removeColumn("sellRequests", "healthCondition");
    await queryInterface.removeColumn("sellRequests", "storageTemperature");
    await queryInterface.removeColumn("sellRequests", "brand");
    await queryInterface.removeColumn("sellRequests", "generation");
    await queryInterface.removeColumn("sellRequests", "treatmentStatus");
    await queryInterface.removeColumn("sellRequests", "seedSourceType");
    await queryInterface.removeColumn("sellRequests", "sproutingCondition");
    await queryInterface.removeColumn("sellRequests", "physicalCondition");
    await queryInterface.removeColumn("sellRequests", "roguingStatus");
    await queryInterface.removeColumn("sellRequests", "perTubeWeight");
    await queryInterface.removeColumn("sellRequests", "diseaseFreeCertified");
    await queryInterface.removeColumn("sellRequests", "productionMethod");
    await queryInterface.removeColumn("sellRequests", "productionDate");
    await queryInterface.removeColumn("sellRequests", "tpod");
    await queryInterface.removeColumn("sellRequests", "uc");
    await queryInterface.removeColumn("sellRequests", "dryMatter");
  },
};
