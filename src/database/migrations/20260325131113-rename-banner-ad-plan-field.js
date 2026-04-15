"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn(
      "bannerAdPlans",
      "durationInMonths",
      "durationInDays",
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn(
      "bannerAdPlans",
      "durationInDays",
      "durationInMonths",
    );
  },
};
