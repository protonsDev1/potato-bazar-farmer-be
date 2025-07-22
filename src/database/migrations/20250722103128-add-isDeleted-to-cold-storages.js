"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("coldStorages", "isDeleted", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });

    await queryInterface.addIndex("coldStorages", ["isDeleted"]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex("coldStorages", ["isDeleted"]);
    await queryInterface.removeColumn("coldStorages", "isDeleted");
  },
};
