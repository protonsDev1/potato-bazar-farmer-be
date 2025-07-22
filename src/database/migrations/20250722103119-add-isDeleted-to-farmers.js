"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Farmers", "isDeleted", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });

    await queryInterface.addIndex("Farmers", ["isDeleted"]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex("Farmers", ["isDeleted"]);
    await queryInterface.removeColumn("Farmers", "isDeleted");
  },
};
