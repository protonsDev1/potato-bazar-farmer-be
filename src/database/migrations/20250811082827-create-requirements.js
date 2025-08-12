"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("coldStorageRequirements", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      requirementUid: {
        type: Sequelize.STRING,
        allowNull: false,
        unqiue: true,
      },
      location: {
        type: Sequelize.STRING,
      },
      district: {
        type: Sequelize.STRING,
      },
      state: {
        type: Sequelize.STRING,
      },
      verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      quantity: {
        type: Sequelize.STRING,
      },
      capacityMin: {
        type: Sequelize.INTEGER,
      },
      capacityMax: {
        type: Sequelize.INTEGER,
      },
      duration: {
        type: Sequelize.STRING,
      },
      storageType: {
        type: Sequelize.STRING,
      },
      requiredFromDate: {
        type: Sequelize.DATE,
      },
      preferredLocation: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      specialcoldStorageRequirements: {
        type: Sequelize.TEXT,
      },
      contactNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("coldStorageRequirements");
  },
};
