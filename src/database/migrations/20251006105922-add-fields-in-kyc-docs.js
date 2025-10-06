"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("kyc_documents", "gstNumber", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("kyc_documents", "fssaiNumber", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("kyc_documents", "gstNumber");
    await queryInterface.removeColumn("kyc_documents", "fssaiNumber");
  },
};
