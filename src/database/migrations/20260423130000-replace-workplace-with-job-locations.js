"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove the workplace column
    await queryInterface.removeColumn("jobs", "workplace");

    // Add the jobLocations JSON column (placed after vacancies conceptually)
    await queryInterface.addColumn("jobs", "jobLocations", {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: null,
      comment:
        'Array of { stateId: number, districtIds: number[] } e.g. [{"stateId":1,"districtIds":[10,20]}]',
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the jobLocations column
    await queryInterface.removeColumn("jobs", "jobLocations");

    // Re-add the workplace column
    await queryInterface.addColumn("jobs", "workplace", {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
    });
  },
};
