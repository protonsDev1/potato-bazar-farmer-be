"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Farmers", "firstName", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("Farmers", "lastName", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("coldStorages", "firstName", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("coldStorages", "lastName", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("traders", "firstName", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("traders", "lastName", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Farmers", "firstName");
    await queryInterface.removeColumn("Farmers", "lastName");
    await queryInterface.removeColumn("coldStorages", "firstName");
    await queryInterface.removeColumn("coldStorages", "lastName");
    await queryInterface.removeColumn("traders", "firstName");
    await queryInterface.removeColumn("traders", "lastName");
  },
};
