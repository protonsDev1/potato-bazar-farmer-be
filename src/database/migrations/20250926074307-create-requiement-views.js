"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("csReqirementViews", {
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
      requirementId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "coldStorageRequirements",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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

    await queryInterface.addConstraint("csReqirementViews", {
      fields: ["userId", "requirementId"],
      type: "unique",
      name: "unique_user_requirement_view",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("csReqirementViews");
  },
};
