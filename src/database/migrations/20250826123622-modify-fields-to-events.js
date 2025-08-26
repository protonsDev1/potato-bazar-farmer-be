"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("events", "image");
    await queryInterface.removeColumn("events", "document");

    await queryInterface.addColumn("events", "image", {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
    });

    await queryInterface.addColumn("events", "document", {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
    });

    await queryInterface.addColumn("events", "city", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("events", "city");

    await queryInterface.removeColumn("events", "image");
    await queryInterface.removeColumn("events", "document");

    await queryInterface.addColumn("events", "image", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("events", "document", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
