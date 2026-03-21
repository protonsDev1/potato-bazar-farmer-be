"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("userDirectorySubscriptions", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },

      userId: {
        type: Sequelize.INTEGER,
        references: { model: "users", key: "id" },
      },

      planId: {
        type: Sequelize.INTEGER,
        references: { model: "directorySubscriptionPlans", key: "id" },
      },

      startDate: { type: Sequelize.DATE },
      endDate: { type: Sequelize.DATE },

      status: { type: Sequelize.STRING, defaultValue: "active" },

      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW") },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW") },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("userDirectorySubscriptions");
  },
};
