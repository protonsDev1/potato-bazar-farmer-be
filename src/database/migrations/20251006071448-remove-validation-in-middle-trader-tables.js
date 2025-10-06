"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.changeColumn("cropsTraded", "cropName", {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.changeColumn("marketCoverages", "name", {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.changeColumn("procurementRegions", "name", {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.changeColumn("traderInterests", "interest", {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.changeColumn("traderTypes", "type", {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.changeColumn("traderVarieties", "variety", {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.changeColumn("mandiDetails", "mandiName", {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.changeColumn("mandiDetails", "state", {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.changeColumn("mandiDetails", "cityOrVillage", {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.changeColumn("mandiDetails", "shopNumber", {
        type: Sequelize.STRING,
      }),
    ]);
  },
  async down(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.changeColumn("cropsTraded", "cropName", {
        type: Sequelize.STRING(100),
        allowNull: false,
      }),
      queryInterface.changeColumn("marketCoverages", "name", {
        type: Sequelize.STRING(100),
        allowNull: false,
      }),
      queryInterface.changeColumn("procurementRegions", "name", {
        type: Sequelize.STRING(100),
        allowNull: false,
      }),
      queryInterface.changeColumn("traderInterests", "interest", {
        type: Sequelize.STRING(100),
        allowNull: false,
      }),
      queryInterface.changeColumn("traderTypes", "type", {
        type: Sequelize.STRING(100),
        allowNull: false,
      }),
      queryInterface.changeColumn("traderVarieties", "variety", {
        type: Sequelize.STRING(100),
        allowNull: false,
      }),
      queryInterface.changeColumn("mandiDetails", "mandiName", {
        type: Sequelize.STRING(100),
        allowNull: false,
      }),
      queryInterface.changeColumn("mandiDetails", "state", {
        type: Sequelize.STRING(100),
        allowNull: false,
      }),
      queryInterface.changeColumn("mandiDetails", "cityOrVillage", {
        type: Sequelize.STRING(100),
        allowNull: false,
      }),
      queryInterface.changeColumn("mandiDetails", "shopNumber", {
        type: Sequelize.STRING(50),
      }),
    ]);
  },
};