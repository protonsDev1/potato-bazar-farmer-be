'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('cold_storages', 'onBoardedBy', {
      type: Sequelize.INTEGER,
      allowNull: true ,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('cold_storages', 'onBoardedBy');
  },
};
