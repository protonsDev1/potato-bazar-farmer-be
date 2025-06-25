"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("districts", "stateId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "states",
        key: "id",
      },
      onDelete: "CASCADE",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("districts", "stateId");
  },
};
