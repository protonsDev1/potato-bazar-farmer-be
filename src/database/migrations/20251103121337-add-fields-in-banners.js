"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn("banners", "text", "name");

    await queryInterface.changeColumn("banners", "name", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("banners", "image", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn("banners", "startDate", {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });

    await queryInterface.addColumn("banners", "endDate", {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });

    await queryInterface.addColumn("banners", "redirectionUrl", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("banners", "position", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn("banners", "eventId", {
      type: Sequelize.INTEGER,
      references: { model: "events", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("banners", "image");
    await queryInterface.removeColumn("banners", "startDate");
    await queryInterface.removeColumn("banners", "endDate");
    await queryInterface.removeColumn("banners", "redirectionUrl");
    await queryInterface.removeColumn("banners", "position");
    await queryInterface.removeColumn("banners", "eventId");

    await queryInterface.renameColumn("banners", "name", "text");

    await queryInterface.changeColumn("banners", "text", {
      type: Sequelize.TEXT,
      allowNull: false,
    });
  },
};
