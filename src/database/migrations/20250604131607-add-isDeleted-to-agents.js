// migrations/XXXXXXXXXXXXXX-add-isDeleted-to-agents.js

'use strict';

module.exports = {
  up: async(queryInterface, Sequelize)=> {
    await queryInterface.addColumn('agents', 'isDeleted', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },

  down: async(queryInterface, Sequelize)=> {
    await queryInterface.removeColumn('agents', 'isDeleted');
  },
};
