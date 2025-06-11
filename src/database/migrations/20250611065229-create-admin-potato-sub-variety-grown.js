"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("adminPotatoSubVarietiesGrown", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      varietyId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "adminPotatoVarietiesGrown",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      position: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("adminPotatoSubVarietiesGrown");
  },
};
