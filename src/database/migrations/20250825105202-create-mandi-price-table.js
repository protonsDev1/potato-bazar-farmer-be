"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("mandiPrices", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      mandiName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      variety: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      state: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      arrivalStatus: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      totalArrivalBags: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      normalMandiArrivalBags: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      isDeleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    // Indexes
    await queryInterface.addIndex("mandiPrices", ["state"]);
    await queryInterface.addIndex("mandiPrices", ["city"]);
    await queryInterface.addIndex("mandiPrices", ["mandiName"]);
    await queryInterface.addIndex("mandiPrices", ["variety"]);
    await queryInterface.addIndex("mandiPrices", ["isActive"]);
    await queryInterface.addIndex("mandiPrices", ["isDeleted"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("mandiPrices");
  },
};
