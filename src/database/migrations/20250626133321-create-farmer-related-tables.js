"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("adminSellingChannels", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
      position: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
    });

    await queryInterface.createTable("adminSellingPrices", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
      position: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
    });

    await queryInterface.createTable("adminBrandPreferenceReasons", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
      position: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
    });

    await queryInterface.createTable("adminSellingPlaces", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
      position: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
    });

    await queryInterface.createTable("adminSeedBrands", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
      position: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
    });

    await queryInterface.createTable("adminIrrigationMethods", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
      position: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
    });

    await queryInterface.createTable("irrigationMethods", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      farmerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Farmers", key: "id" },
        onDelete: "CASCADE",
      },
      method: { type: Sequelize.STRING, allowNull: false },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
    });
    await queryInterface.addIndex("irrigationMethods", ["farmerId"]);

    await queryInterface.createTable("sellingPrices", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      farmerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Farmers", key: "id" },
        onDelete: "CASCADE",
      },
      price: { type: Sequelize.STRING, allowNull: false },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
    });
    await queryInterface.addIndex("sellingPrices", ["farmerId"]);

    await queryInterface.createTable("brandPreferenceReasons", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      farmerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Farmers", key: "id" },
        onDelete: "CASCADE",
      },
      reason: { type: Sequelize.STRING, allowNull: false },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
    });
    await queryInterface.addIndex("brandPreferenceReasons", ["farmerId"]);

    await queryInterface.createTable("sellingPlaces", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      farmerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Farmers", key: "id" },
        onDelete: "CASCADE",
      },
      place: { type: Sequelize.STRING, allowNull: false },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
    });
    await queryInterface.addIndex("sellingPlaces", ["farmerId"]);

    await queryInterface.createTable("otherCropsGrown", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      farmerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Farmers", key: "id" },
        onDelete: "CASCADE",
      },
      cropName: { type: Sequelize.STRING, allowNull: false },
      sowingMonth: { type: Sequelize.STRING, allowNull: false },
      harvestingMonth: { type: Sequelize.STRING, allowNull: false },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
    });
    await queryInterface.addIndex("otherCropsGrown", ["farmerId"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("otherCropsGrown");
    await queryInterface.dropTable("irrigationMethods");
    await queryInterface.dropTable("sellingPrices");
    await queryInterface.dropTable("brandPreferenceReasons");
    await queryInterface.dropTable("sellingPlaces");
    await queryInterface.dropTable("adminIrrigationMethods");
    await queryInterface.dropTable("adminSeedBrands");
    await queryInterface.dropTable("adminSellingPlaces");
    await queryInterface.dropTable("adminBrandPreferenceReasons");
    await queryInterface.dropTable("adminSellingPrices");
    await queryInterface.dropTable("adminSellingChannels");
  },
};
