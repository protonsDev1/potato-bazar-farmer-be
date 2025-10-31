"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("askExperts", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      cropDiagnosedId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "cropDiagnoses",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      query: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      response: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: "open"
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
    await queryInterface.dropTable("askExperts");
  },
};
