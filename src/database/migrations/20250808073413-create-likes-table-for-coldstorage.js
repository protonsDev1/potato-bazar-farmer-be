"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("likeColdStorages", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      coldStorageId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "coldStorages",
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

    await queryInterface.addIndex("likeColdStorages", {
      fields: ["userId", "coldStorageId"],
      type: "unique",
      name: "unique_user_coldstorage_like",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("likeColdStorages");
  },
};
