"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn("events", "ownerName", "organiserName");

    await queryInterface.removeColumn("events", "status");

    await queryInterface.removeIndex("events", ["status"]);

    await queryInterface.addColumn("events", "isFeatured", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn("events", "organiserName", "ownerName");

    await queryInterface.addColumn("events", "status", {
      type: Sequelize.ENUM("pending", "rejected", "approved"),
      allowNull: false,
      defaultValue: "pending",
    });

    await queryInterface.addIndex("events", ["status"]);

    await queryInterface.removeColumn("events", "isFeatured");
  },
};
