'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('news', 'createdBy', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn('news', 'source', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('news', 'createdBy');
    await queryInterface.removeColumn('news', 'source');
  },
};
