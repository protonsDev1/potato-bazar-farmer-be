"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("adminMarketCoverages", {
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

    await queryInterface.createTable("marketCoverages", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      traderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "traders", key: "id" },
        onDelete: "CASCADE",
      },
      name: { type: Sequelize.STRING, allowNull: false },
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
    await queryInterface.addIndex("marketCoverages", ["traderId"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("marketCoverages");
    await queryInterface.dropTable("adminMarketCoverages");
  },
};
