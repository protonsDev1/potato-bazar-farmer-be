'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('kyc_documents', 'status', {
      type: Sequelize.STRING,
      allowNull: true, // or false if you want it required
      defaultValue: 'pending' // you can set default (optional)
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('kyc_documents', 'status');
  }
};
