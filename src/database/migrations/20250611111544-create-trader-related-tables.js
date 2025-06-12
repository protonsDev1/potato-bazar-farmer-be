"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // adminTraderVarieties
    await queryInterface.createTable("adminTraderVarieties", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      variety: { type: Sequelize.STRING(100), allowNull: false },
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

    // traderVarieties
    await queryInterface.createTable("traderVarieties", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      traderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "traders", key: "id" },
        onDelete: "CASCADE",
      },
      variety: { type: Sequelize.STRING(100), allowNull: false },
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

    // adminTraderTypes
    await queryInterface.createTable("adminTraderTypes", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      type: { type: Sequelize.STRING(100), allowNull: false },
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

    // traderTypes
    await queryInterface.createTable("traderTypes", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      traderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "traders", key: "id" },
        onDelete: "CASCADE",
      },
      type: { type: Sequelize.STRING(100), allowNull: false },
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

    // mandiDetails
    await queryInterface.createTable("mandiDetails", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      traderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: "traders", key: "id" },
        onDelete: "CASCADE",
      },
      state: { type: Sequelize.STRING(100), allowNull: false },
      cityOrVillage: { type: Sequelize.STRING(100), allowNull: false },
      mandiName: { type: Sequelize.STRING(100), allowNull: false },
      shopNumber: { type: Sequelize.STRING(50) },
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

    // adminCropsTraded
    await queryInterface.createTable("adminCropsTraded", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      cropName: { type: Sequelize.STRING(100), allowNull: false },
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

    // cropsTraded
    await queryInterface.createTable("cropsTraded", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      traderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "traders", key: "id" },
        onDelete: "CASCADE",
      },
      cropName: { type: Sequelize.STRING(100), allowNull: false },
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

    // bankDetails
    await queryInterface.createTable("bankDetails", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      traderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: "traders", key: "id" },
        onDelete: "CASCADE",
      },
      bankName: { type: Sequelize.STRING(255), allowNull: false },
      accountNumber: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      ifscCode: { type: Sequelize.STRING(20), allowNull: false },
      upiId: { type: Sequelize.STRING(100), unique: true },
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

    // adminTraderInterests
    await queryInterface.createTable("adminTraderInterests", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      interest: { type: Sequelize.STRING(100), allowNull: false },
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

    // traderInterests
    await queryInterface.createTable("traderInterests", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      traderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "traders", key: "id" },
        onDelete: "CASCADE",
      },
      interest: { type: Sequelize.STRING(100), allowNull: false },
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

    // traderDocuments
    await queryInterface.createTable("traderDocuments", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      traderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: "traders", key: "id" },
        onDelete: "CASCADE",
      },
      panCardUrl: { type: Sequelize.TEXT },
      businessCardUrl: { type: Sequelize.TEXT },
      tradeLicenseUrl: { type: Sequelize.TEXT },
      recentInvoiceUrl: { type: Sequelize.TEXT },
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

    await queryInterface.addIndex("traderVarieties", ["traderId", "variety"], {
      unique: true,
    });
    await queryInterface.addIndex("traderTypes", ["traderId", "type"], {
      unique: true,
    });
    await queryInterface.addIndex("cropsTraded", ["traderId", "cropName"], {
      unique: true,
    });
    await queryInterface.addIndex("traderInterests", ["traderId", "interest"], {
      unique: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("traderDocuments");
    await queryInterface.dropTable("traderInterests");
    await queryInterface.dropTable("adminTraderInterests");
    await queryInterface.dropTable("bankDetails");
    await queryInterface.dropTable("cropsTraded");
    await queryInterface.dropTable("adminCropsTraded");
    await queryInterface.dropTable("mandiDetails");
    await queryInterface.dropTable("traderTypes");
    await queryInterface.dropTable("adminTraderTypes");
    await queryInterface.dropTable("traderVarieties");
    await queryInterface.dropTable("adminTraderVarieties");
  },
};
