'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('LandDetails', 'harvestMonth', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('LandDetails', 'equipmentSource', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('LandDetails', 'storedInColdStoragePercent', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('LandDetails', 'harvestMonth');
    await queryInterface.removeColumn('LandDetails', 'equipmentSource');
    await queryInterface.removeColumn('LandDetails', 'storedInColdStoragePercent');
  },
};
