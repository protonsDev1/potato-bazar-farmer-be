"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("mandiGradePrices", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      mandiPriceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "mandiPrices",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      mandiGradeType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      gradeArrivalPercentage: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      gradePricePerKg: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      quantityInBags: {
        type: Sequelize.INTEGER,
        allowNull: false,
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

    // Index
    await queryInterface.addIndex("mandiGradePrices", ["mandiPriceId"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("mandiGradePrices");
  },
};
