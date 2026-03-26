"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // add new column
    await queryInterface.addColumn("contactUnlocks", "modulePricingId", {
      type: Sequelize.INTEGER,
      references: {
        model: "modulePricings",
        key: "id",
      },
    });

    // remove old columns
    await queryInterface.removeColumn("contactUnlocks", "module");
    await queryInterface.removeColumn("contactUnlocks", "ownerUserId");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("contactUnlocks", "module", {
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn("contactUnlocks", "ownerUserId", {
      type: Sequelize.INTEGER,
    });

    await queryInterface.removeColumn("contactUnlocks", "modulePricingId");
  },
};
