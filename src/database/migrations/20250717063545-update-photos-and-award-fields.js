"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("coldStorages", "awardOrCertificate");

    await queryInterface.addColumn("coldStorages", "awardOrCertificate", {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
    });

    await queryInterface.removeColumn("coldStorages", "photos");

    await queryInterface.addColumn("coldStorages", "photos", {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("coldStorages", "awardOrCertificate");
    await queryInterface.addColumn("coldStorages", "awardOrCertificate", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.removeColumn("coldStorages", "photos");
    await queryInterface.addColumn("coldStorages", "photos", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
