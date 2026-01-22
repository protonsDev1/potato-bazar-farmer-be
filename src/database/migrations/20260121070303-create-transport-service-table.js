"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("transportServices", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      transporterType: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      vehicleTypeRequired: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
      },

      noOfVehicles: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      routeCoverage: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
      },

      rateType: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      additionalRequired: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },

      documents: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },

      ownerOrCompanyName: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      whatsappNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      alternatePhoneNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },

      reason: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      pbVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      isAvailable: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },

      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "pending",
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("transportServices");
  },
};
