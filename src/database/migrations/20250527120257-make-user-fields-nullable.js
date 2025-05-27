'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.changeColumn('users', 'name', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.changeColumn('users', 'email', {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      }),
      queryInterface.changeColumn('users', 'password_hash', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.changeColumn('users', 'role', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.changeColumn('users', 'createdAt', {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
      }),
      queryInterface.changeColumn('users', 'updatedAt', {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.changeColumn('users', 'name', {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.changeColumn('users', 'email', {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      }),
      queryInterface.changeColumn('users', 'password_hash', {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.changeColumn('users', 'role', {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.changeColumn('users', 'createdAt', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      }),
      queryInterface.changeColumn('users', 'updatedAt', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      }),
    ]);
  },
};
