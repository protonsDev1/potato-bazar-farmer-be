"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("agents", "isDeleted", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.addIndex("agents", ["isDeleted"]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex("agents", ["isDeleted"]);
    await queryInterface.removeColumn("agents", "isDeleted");
  },
};
