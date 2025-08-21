"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("eventRequests", "name", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("eventRequests", "mobile", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.removeConstraint(
      "eventRequests",
      "unique_user_event_request"
    );

    await queryInterface.removeIndex("eventRequests", ["userId"]);

    await queryInterface.renameColumn(
      "eventRequests",
      "userId",
      "requestCreatedBy"
    );

    await queryInterface.addIndex("eventRequests", ["requestCreatedBy"]);

    await queryInterface.addConstraint("eventRequests", {
      fields: ["requestCreatedBy", "eventId"],
      type: "unique",
      name: "unique_user_event_request",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "eventRequests",
      "unique_user_event_request"
    );

    await queryInterface.removeIndex("eventRequests", ["requestCreatedBy"]);

    await queryInterface.renameColumn(
      "eventRequests",
      "requestCreatedBy",
      "userId"
    );

    await queryInterface.addIndex("eventRequests", ["userId"]);

    await queryInterface.addConstraint("eventRequests", {
      fields: ["userId", "eventId"],
      type: "unique",
      name: "unique_user_event_request",
    });

    await queryInterface.removeColumn("eventRequests", "name");
    await queryInterface.removeColumn("eventRequests", "mobile");
  },
};
