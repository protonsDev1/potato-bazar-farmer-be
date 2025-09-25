"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.renameColumn("traderDocuments", "FSSAICertifiateUrl", "FSSAICertificateUrl")
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.renameColumn("traderDocuments", "FSSAICertificateUrl", "FSSAICertifiateUrl")
  },
};
