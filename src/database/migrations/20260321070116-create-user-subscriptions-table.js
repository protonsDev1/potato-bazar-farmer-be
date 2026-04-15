"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("userSubscriptions", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },

      userId: {
        type: Sequelize.INTEGER,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
      },

      planId: {
        type: Sequelize.INTEGER,
        references: { model: "subscriptionPlans", key: "id" },
      },

      startDate: { type: Sequelize.DATE },

      endDate: { type: Sequelize.DATE },

      status: { type: Sequelize.STRING, defaultValue: "active" },

      paymentSource: { type: Sequelize.STRING },

      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW") },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW") },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("userSubscriptions");
  },
};
