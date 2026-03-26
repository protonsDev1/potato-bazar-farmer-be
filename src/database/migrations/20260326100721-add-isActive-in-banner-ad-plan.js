"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("bannerAdPlans", "isActive", {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("bannerAdPlans", "isActive");
  },
};
