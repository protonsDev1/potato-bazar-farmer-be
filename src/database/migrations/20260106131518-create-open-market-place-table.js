"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("openMarketPlaces", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      category: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      machineryCategory: Sequelize.STRING,
      equipmentType: Sequelize.STRING,
      brandName: Sequelize.STRING,
      modelName: Sequelize.STRING,
      condition: Sequelize.STRING,
      yearOfPurchase: Sequelize.STRING,
      expectedPrice: Sequelize.STRING,

      serviceCategory: Sequelize.STRING,
      serviceCoverageArea: Sequelize.TEXT,
      serviceUnit: Sequelize.STRING,
      serviceChargesPerUnit: Sequelize.FLOAT,

      packaging: Sequelize.STRING,
      materialType: Sequelize.STRING,
      bagSize: Sequelize.STRING,
      packagingUnit: Sequelize.STRING,
      packagingUnitRate: Sequelize.FLOAT,
      delivery: Sequelize.STRING,

      typeOfFarming: Sequelize.STRING,
      potatoVariety: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      contractType: Sequelize.STRING,
      contractUnit: Sequelize.STRING,
      contractUnitRate: Sequelize.FLOAT,
      fromMonth: Sequelize.STRING,
      toMonth: Sequelize.STRING,
      paymentTerms: Sequelize.STRING,
      contractFarmingRegion: Sequelize.TEXT,

      areaUnit: Sequelize.STRING,
      totalArea: Sequelize.FLOAT,
      landOrLeaseContractType: Sequelize.STRING,
      numberOfYears: Sequelize.INTEGER,
      numberOfMonths: Sequelize.INTEGER,
      irrigationAvailability: Sequelize.BOOLEAN,
      soilType: Sequelize.STRING,

      description: Sequelize.TEXT,
      state: Sequelize.STRING,
      district: Sequelize.STRING,
      locationOrCity: Sequelize.STRING,
      pinCodeOrDigiPin: Sequelize.STRING,
      nameOrCompanyName: Sequelize.STRING,
      email: Sequelize.STRING,
      phoneNumber: Sequelize.STRING,
      whatsappNumber: Sequelize.STRING,
      alternatePhoneNumber: Sequelize.STRING,

      attachments: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },

      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "pending",
      },

      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
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
    await queryInterface.dropTable("openMarketPlaces");
  },
};
