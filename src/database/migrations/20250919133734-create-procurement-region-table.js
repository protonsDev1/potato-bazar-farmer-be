"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("procurementRegions", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      traderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "traders",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    await queryInterface.addIndex("procurementRegions", ["traderId", "name"], {
      unique: true,
      name: "procurementRegions_traderId_name_unique",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("procurementRegions");
  },
};
