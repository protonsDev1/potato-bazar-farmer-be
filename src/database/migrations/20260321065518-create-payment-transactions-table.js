"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("paymentTransactions", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
      },

      razorpayOrderId: {
        type: Sequelize.STRING,
      },

      razorpayPaymentId: {
        type: Sequelize.STRING,
      },

      amount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },

      type: {
        type: Sequelize.STRING, // wallet_topup
      },

      status: {
        type: Sequelize.STRING, // created | success | failed
        defaultValue: "created",
      },

      metadata: {
        type: Sequelize.JSON,
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
  },

  async down(queryInterface) {
    await queryInterface.dropTable("paymentTransactions");
  },
};