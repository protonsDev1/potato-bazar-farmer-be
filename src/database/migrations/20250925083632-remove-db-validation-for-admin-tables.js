"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("adminCropsTraded", "name", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn("adminTraderInterests", "name", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn("adminTraderTypes", "name", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.changeColumn("adminTraderVarieties", "name", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("adminCropsTraded", "name", {
      type: Sequelize.STRING(100),
      allowNull: false,
    });

    await queryInterface.changeColumn("adminTraderInterests", "name", {
      type: Sequelize.STRING(100),
      allowNull: false,
    });

    await queryInterface.changeColumn("adminTraderTypes", "name", {
      type: Sequelize.STRING(100),
      allowNull: false,
    });
    await queryInterface.changeColumn("adminTraderVarieties", "name", {
      type: Sequelize.STRING(100),
      allowNull: false,
    });
  },
};
