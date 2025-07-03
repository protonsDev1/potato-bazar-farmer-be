"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("adminPotatoTypes", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
      position: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
    });

    await queryInterface.createTable("potatoTypes", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      farmerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Farmers", key: "id" },
        onDelete: "CASCADE",
      },
      type: { type: Sequelize.STRING, allowNull: false },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
    });
    await queryInterface.addIndex("potatoTypes", ["farmerId"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("potatoTypes");
    await queryInterface.dropTable("adminPotatoTypes");
  },
};
