"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("exporterDetails", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      traderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: "traders",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      regions: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      isCustomRegion: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      potatoVarieties: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      isCustomPotatoVariety: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      quantityPerYear: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("exporterDetails");
  },
};
