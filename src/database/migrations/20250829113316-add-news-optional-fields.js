'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('news', 'introduction', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('news', 'keyNumbers', {
      type: Sequelize.JSON,
      allowNull: true,
    });
    await queryInterface.addColumn('news', 'changesThisWeek', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('news', 'supplyAnalysis', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('news', 'demandSignals', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('news', 'regionalSnapshot', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('news', 'policyRisks', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('news', 'faqs', {
      type: Sequelize.JSON,
      allowNull: true,
    });
    await queryInterface.addColumn('news', 'references', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('news', 'introduction');
    await queryInterface.removeColumn('news', 'keyNumbers');
    await queryInterface.removeColumn('news', 'changesThisWeek');
    await queryInterface.removeColumn('news', 'supplyAnalysis');
    await queryInterface.removeColumn('news', 'demandSignals');
    await queryInterface.removeColumn('news', 'regionalSnapshot');
    await queryInterface.removeColumn('news', 'policyRisks');
    await queryInterface.removeColumn('news', 'faqs');
    await queryInterface.removeColumn('news', 'references');
  },
};
