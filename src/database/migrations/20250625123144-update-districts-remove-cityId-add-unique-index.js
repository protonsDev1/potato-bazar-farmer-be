"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("districts", "cityId");

    await queryInterface.addIndex("districts", ["name", "stateId"], {
      unique: true,
      name: "districts_name_stateId_unique",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex(
      "districts",
      "districts_name_stateId_unique"
    );

    await queryInterface.addColumn("districts", "cityId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "cities",
        key: "id",
      },
      onDelete: "CASCADE",
    });
  },
};
