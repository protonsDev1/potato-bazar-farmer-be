// migration example (sequelize-cli)
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("kyc_documents", "approvedAt", {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn("kyc_documents", "approvedAt");
  },
};
