"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.renameColumn("otps", "otp", "otpHash");
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.renameColumn("otps", "otpHash", "otp");
  },
};
