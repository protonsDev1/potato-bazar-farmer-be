"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("contactUnlocks", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },

      userId: {
        type: Sequelize.INTEGER,
        references: { model: "users", key: "id" },
      },

      ownerUserId: {
        type: Sequelize.INTEGER,
        references: { model: "users", key: "id" },
      },

      module: {
        type: Sequelize.STRING,
      },

      recordId: {
        type: Sequelize.INTEGER,
      },

      price: {
        type: Sequelize.DECIMAL(10, 2),
      },

      paymentSource: {
        type: Sequelize.STRING,
      },

      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW") },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW") },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("contactUnlocks");
  },
};
