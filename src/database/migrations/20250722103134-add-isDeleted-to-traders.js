"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("traders", "isDeleted", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });

    await queryInterface.addIndex("traders", ["isDeleted"]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex("traders", ["isDeleted"]);
    await queryInterface.removeColumn("traders", "isDeleted");
  },
};
