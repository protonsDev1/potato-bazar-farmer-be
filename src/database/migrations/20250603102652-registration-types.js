'use strict';

module.exports = {
  up: async(queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'registration_types', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
      validate: {
        notEmpty: true,
        isIn: [['farmer', 'cold_storage', 'trader']],
      },
    });
  },

  down: async(queryInterface, Sequelize) =>{
    await queryInterface.removeColumn('users', 'registration_types');
  }
};
