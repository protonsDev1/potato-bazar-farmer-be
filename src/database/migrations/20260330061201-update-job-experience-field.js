"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("jobs", "experienceRequired", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("jobs", "experienceRequired", {
      type: Sequelize.FLOAT,
      allowNull: false,
    });
  },
};
