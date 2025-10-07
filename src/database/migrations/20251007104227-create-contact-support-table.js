"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("contactSupport", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      fullName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      mobileNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      preferredDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      preferredTime: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("contactSupport");
  },
};