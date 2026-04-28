"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("liveAuctions", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
      },

      auctionDate: {
        type: Sequelize.DATEONLY,
      },

      auctionTime: {
        type: Sequelize.TIME,
      },

      // 🔹 Basic Info
      potatoType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      potatoVariety: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      unit: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      minReservePrice: {
        type: Sequelize.FLOAT,
      },
      qualityGrade: {
        type: Sequelize.STRING,
      },

      // 🔹 Specifications
      packagingType: Sequelize.STRING,
      delivery: Sequelize.STRING,
      size: Sequelize.STRING,
      sugarContent: Sequelize.STRING,
      skinSet: Sequelize.STRING,
      fleshColor: Sequelize.STRING,

      // 🔹 Other Info
      soilAdherence: Sequelize.STRING,
      firmness: Sequelize.STRING,
      sproutingStatus: Sequelize.STRING,
      organicCertified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      harvestDate: Sequelize.DATE,
      deliveryWindow: Sequelize.INTEGER,
      deliveryType: Sequelize.STRING,
      qualityResponsibilty: Sequelize.STRING,

      state: Sequelize.STRING,
      district: Sequelize.STRING,
      locationOrCity: Sequelize.STRING,
      pinCode: Sequelize.STRING,

      paymentTimeLine: {
        type: Sequelize.FLOAT,
      },

      fullLotView: Sequelize.STRING,
      closeQualityView: Sequelize.STRING,
      randomSampleView: Sequelize.STRING,
      storageView: Sequelize.STRING,
      defectPhotos: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },

      lotOverviewVideos: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },

      attachment: Sequelize.STRING,

      // 🔹 Auction Fields (IMPORTANT)
      scheduleDate: {
        type: Sequelize.DATEONLY,
      },

      scheduleTime: {
        type: Sequelize.TIME,
      },

      contactPerson: Sequelize.STRING,
      contactNumber: Sequelize.STRING,
      inspectionAddress: Sequelize.TEXT,

      status: {
        type: Sequelize.STRING,
        defaultValue: "pending", // pending | approved | rejected
      },

      verifiedAt: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable("liveAuctions");
  },
};
