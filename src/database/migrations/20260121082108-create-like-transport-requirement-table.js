"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("likeTransportRequirements", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      requirementId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "transportRequirements",
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

    // Unique index for (userId + requirementId)
    await queryInterface.addIndex(
      "likeTransportRequirements",
      ["userId", "requirementId"],
      {
        unique: true,
        name: "unique_user_transport_requirement_like",
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("likeTransportRequirements");
  },
};
