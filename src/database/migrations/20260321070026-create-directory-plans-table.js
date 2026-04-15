"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("directorySubscriptionPlans", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },

      name: { type: Sequelize.STRING },

      price: { type: Sequelize.DECIMAL(12, 2) },

      durationInMonths: { type: Sequelize.INTEGER },

      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },

      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW") },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW") },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("directorySubscriptionPlans");
  },
};
