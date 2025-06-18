'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'registration_types', {
      type: Sequelize.STRING, // or Sequelize.ARRAY(Sequelize.STRING) if multiple values
      allowNull: true,        // change to false if required
      defaultValue: null      // or set a default value
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'registration_types');
  }
};
