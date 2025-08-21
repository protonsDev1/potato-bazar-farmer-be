"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("favouriteRequests", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      buyRequestId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "buyRequests",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      sellRequestId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "sellRequests",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
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

    await queryInterface.addConstraint("favouriteRequests", {
      fields: ["userId", "buyRequestId"],
      type: "unique",
      name: "unique_user_buy_favourite",
    });

    await queryInterface.addConstraint("favouriteRequests", {
      fields: ["userId", "sellRequestId"],
      type: "unique",
      name: "unique_user_sell_favourite",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("favouriteRequests");
  },
};
