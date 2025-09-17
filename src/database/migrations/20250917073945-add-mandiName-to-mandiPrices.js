"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("mandiPrices", "state");
    await queryInterface.removeColumn("mandiPrices", "city");

    await queryInterface.addColumn("mandiPrices", "cityId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "cities", 
        key: "id",
      },
      onDelete: "CASCADE",
    });

    await queryInterface.addIndex("mandiPrices", ["cityId"]);
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.removeColumn("mandiPrices", "cityId");

    await queryInterface.addColumn("mandiPrices", "state", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn("mandiPrices", "city", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
