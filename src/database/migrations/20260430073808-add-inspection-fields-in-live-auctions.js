"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = "liveAuctions";

    // 🔹 Inspection
    await queryInterface.addColumn(table, "inspectionReport", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn(table, "defectivePercentage", {
      type: Sequelize.FLOAT,
      allowNull: true,
    });

    await queryInterface.addColumn(table, "inspectionVideos", {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
    });

    await queryInterface.addColumn(table, "inspectionImages", {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
    });

    await queryInterface.addColumn(table, "inspectionBy", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: "users", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  async down(queryInterface) {
    const table = "liveAuctions";

    await queryInterface.removeColumn(table, "rejectionReason");
    await queryInterface.removeColumn(table, "inspectionReport");
    await queryInterface.removeColumn(table, "defectivePercentage");
    await queryInterface.removeColumn(table, "inspectionVideos");
    await queryInterface.removeColumn(table, "inspectionImages");
    await queryInterface.removeColumn(table, "inspectionBy");
  },
};
