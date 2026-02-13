"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("transportServiceViews", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      serviceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "transportServices",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },

      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    // Prevent duplicate views by same user on same requirement
    await queryInterface.addIndex(
      "transportServiceViews",
      ["userId", "serviceId"],
      {
        unique: true,
        name: "unique_transport_user_service_view",
      },
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("transportServiceViews");
  },
};
