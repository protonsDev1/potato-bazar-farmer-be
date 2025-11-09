"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("userNotificationSettings", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
      },
      allowAll: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      buy: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      sell: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      mandiPrice: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      broadcast: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      news: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      event: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      govScheme: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      coldStorage: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    await queryInterface.addIndex("userNotificationSettings", ["userId"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("userNotificationSettings");
  },
};
