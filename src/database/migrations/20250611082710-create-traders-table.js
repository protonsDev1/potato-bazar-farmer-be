"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("traders", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      fullName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      businessName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      mobileNumber: {
        type: Sequelize.STRING(15),
        allowNull: false,
      },
      whatsappNumber: {
        type: Sequelize.STRING(15),
      },
      email: {
        type: Sequelize.STRING,
      },
      state: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      district: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      cityOrVillage: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      pinCode: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      languagePreference: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      companyRegisteredVendor: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      mainCompany: {
        type: Sequelize.STRING,
      },
      numberOfEmployees: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      ownPotatoFarming: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      acres: {
        type: Sequelize.INTEGER,
      },
      yearlyPurchaseVolumeTons: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      mainProcurementRegion: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      geographicalMarketCovered: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      contractFarming: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      spotBuying: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      seedsSales: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      ownColdStorage: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      yearsInTrading: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      averageDailySalesKatta: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      salesOwnPotatoes: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      onlineAuctionInterest: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      bankLoanFacility: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      coldStorageAccess: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      acceptsOnlinePayments: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      panNumber: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      gstNumber: {
        type: Sequelize.STRING(30),
      },
      fssaiNumber: {
        type: Sequelize.STRING(50),
      },
      userId: {
        type: Sequelize.INTEGER,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
      },
      onBoardedBy: {
        type: Sequelize.INTEGER,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
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
  },

  async down(queryInterface) {
    await queryInterface.dropTable("traders");
  },
};
