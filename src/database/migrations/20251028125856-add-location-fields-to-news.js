"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("news", "stateId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "states",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addColumn("news", "districtId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "districts",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("news", "stateId");
    await queryInterface.removeColumn("news", "districtId");
  },
};
