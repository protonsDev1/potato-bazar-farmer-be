"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "eventRequests",
      "unique_user_event_request"
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addConstraint("eventRequests", {
      fields: ["requestCreatedBy", "eventId"],
      type: "unique",
      name: "unique_user_event_request",
    });
  },
};
