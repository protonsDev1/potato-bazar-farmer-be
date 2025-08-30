"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("slabWiseDiscounts", "quantityInMt", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("slabWiseDiscounts", "quantityInMt", {
      type: Sequelize.DECIMAL,
      allowNull: true,
    });
  },
};
