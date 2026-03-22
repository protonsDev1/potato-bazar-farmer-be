"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Step 1: Drop existing wrong FK constraint
    await queryInterface.removeConstraint(
      "likeTransportServices",
      "likeTransportServices_serviceId_fkey",
    );

    // Step 2: Add correct FK constraint → transportServices
    await queryInterface.addConstraint("likeTransportServices", {
      fields: ["serviceId"],
      type: "foreign key",
      name: "likeTransportServices_serviceId_fkey",
      references: {
        table: "transportServices",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove correct FK
    await queryInterface.removeConstraint(
      "likeTransportServices",
      "likeTransportServices_serviceId_fkey",
    );

    // Re-add old (WRONG) FK → transportRequirements (for rollback safety)
    await queryInterface.addConstraint("likeTransportServices", {
      fields: ["serviceId"],
      type: "foreign key",
      name: "likeTransportServices_serviceId_fkey",
      references: {
        table: "transportRequirements", // old reference
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },
};
