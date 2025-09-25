"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("traderDocuments", "gstCertificateUrl", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("traderDocuments", "FSSAICertifiateUrl", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("traderDocuments", "gstCertificateUrl");
    await queryInterface.removeColumn("traderDocuments", "FSSAICertifiateUrl");
  },
};
