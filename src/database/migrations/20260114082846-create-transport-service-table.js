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

      pickLocationOrCity: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      pickDistrict: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      pickState: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      dropLocationOrCity: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      dropDistrict: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      dropState: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      quantityUnit: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      packaging: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      vehicleTypeRequired: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },

      preferredPickUpDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },

      rateExpectation: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      additionalRequired: {
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

      pbVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },

      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "pending",
      },

      reason: {
        type: Sequelize.STRING,
        allowNull: true,
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

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("transportServices");
  },
};
