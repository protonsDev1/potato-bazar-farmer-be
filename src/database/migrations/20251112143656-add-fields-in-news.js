"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.addColumn("news", "ytVideos", {
        type: Sequelize.ARRAY(Sequelize.TEXT),
        allowNull: true,
      }),
      queryInterface.addColumn("news", "isPanIndia", {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.removeColumn("news", "ytVideos"),
      queryInterface.removeColumn("news", "isPanIndia"),
    ]);
  },
};
