"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("directories", "location", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("directories", "annualRevenue", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("directories", "technologyBrands", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn("directories", "associations", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn("directoryMedia", "news", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn("directoryMedia", "events", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn("directories", "planId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "directoryPlans",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.addColumn("directories", "planStartDate", {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn("directories", "planEndDate", {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("directories", "location");
    await queryInterface.removeColumn("directories", "annualRevenue");
    await queryInterface.removeColumn("directories", "technologyBrands");
    await queryInterface.removeColumn("directories", "associations");
    await queryInterface.removeColumn("directoryMedia", "news");
    await queryInterface.removeColumn("directoryMedia", "events");
    await queryInterface.removeColumn("directories", "planId");
    await queryInterface.removeColumn("directories", "planStartDate");
    await queryInterface.removeColumn("directories", "planEndDate");
  },
};
