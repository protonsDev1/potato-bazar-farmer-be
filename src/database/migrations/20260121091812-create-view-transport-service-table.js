"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("transportRequirementViews", {
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

    // Prevent duplicate views by same user on same requirement
    await queryInterface.addIndex(
      "transportRequirementViews",
      ["userId", "requirementId"],
      {
        unique: true,
        name: "unique_transport_user_requirement_view",
      },
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("transportRequirementViews");
  },
};
