'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'registration_types', {
      type: Sequelize.STRING, 
      allowNull: true,        
      defaultValue: null     
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'registration_types');
  }
};
