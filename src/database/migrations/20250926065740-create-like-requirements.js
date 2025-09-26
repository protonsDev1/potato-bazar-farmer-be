"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("likeCSRequirements", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      requirementId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "coldStorageRequirements",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
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

    await queryInterface.addIndex("likeCSRequirements", {
      fields: ["userId", "requirementId"],
      type: "unique",
      name: "unique_user_requirement_like",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("likeCSRequirements");
  },
};
