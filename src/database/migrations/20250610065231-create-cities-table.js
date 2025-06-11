'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('cities', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      stateId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'states',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
    });

    await queryInterface.addConstraint('cities', {
      fields: ['name', 'stateId'],
      type: 'unique',
      name: 'unique_city_per_state'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('cities');
  },
};
