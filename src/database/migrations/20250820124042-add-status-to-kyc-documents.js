'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('kyc_documents', 'status', {
      type: Sequelize.STRING,
      allowNull: true, 
      defaultValue: 'pending' 
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('kyc_documents', 'status');
  }
};
