"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("subscriptionPlans", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },

      name: { type: Sequelize.STRING, allowNull: false },

      price: { type: Sequelize.DECIMAL(12, 2), allowNull: false },

      durationInMonths: { type: Sequelize.INTEGER, allowNull: false },

      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },

      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW") },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW") },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("subscriptionPlans");
  },
};
