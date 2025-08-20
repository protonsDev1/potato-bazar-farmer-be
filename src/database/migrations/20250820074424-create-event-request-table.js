"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("eventRequests", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      eventId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "events",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "pending",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // Add indexes
    await queryInterface.addIndex("eventRequests", ["status"]);
    await queryInterface.addIndex("eventRequests", ["eventId"]);
    await queryInterface.addIndex("eventRequests", ["userId"]);
    await queryInterface.addConstraint("eventRequests", {
      fields: ["userId", "eventId"],
      type: "unique",
      name: "unique_user_event_request",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("eventRequests");
  },
};
