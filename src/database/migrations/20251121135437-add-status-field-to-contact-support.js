"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("contactSupport", "status", {
      type: Sequelize.STRING,
      allowNull: false,
      deafultValue: "open",
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn("contactSupport", "status");
  },
};
