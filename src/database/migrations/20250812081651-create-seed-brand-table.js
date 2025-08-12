"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("seedBrandNames", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      farmerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Farmers",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      isCustom: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    });

    await queryInterface.addIndex("seedBrandNames", ["farmerId"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("seedBrandNames");
  },
};
