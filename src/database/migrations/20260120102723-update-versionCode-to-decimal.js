'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('appVersions', 'versionCode', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('appVersions', 'versionCode', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },
};
