'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('appVersions', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      deviceType: {
        type: Sequelize.ENUM('android', 'ios'),
        allowNull: false,
      },

      version: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },

      versionCode: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('appVersions');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_appVersions_deviceType";'
    );
  },
};
