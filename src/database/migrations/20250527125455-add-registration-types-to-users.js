'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Farmers', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      name: Sequelize.STRING,
      age: Sequelize.INTEGER,
      gender: Sequelize.STRING,
      optionalNumber: Sequelize.STRING,
      caste: Sequelize.STRING,
      subCaste: Sequelize.STRING,
      village: Sequelize.STRING,
      taluka: Sequelize.STRING,
      district: Sequelize.STRING,
      state: Sequelize.STRING,
      getLocation: Sequelize.BOOLEAN,
      isAadhaarCard: Sequelize.BOOLEAN,
      aadhaarNumber: Sequelize.STRING,
      isBankAccount: Sequelize.BOOLEAN,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });

    await queryInterface.createTable('LandDetails', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      farmerId: {
        type: Sequelize.INTEGER,
        references: { model: 'Farmers', key: 'id' },
        onDelete: 'CASCADE',
      },
      landOwnedAcres: Sequelize.FLOAT,
      landLeasedAcres: Sequelize.FLOAT,
      potatoCultivationAcres: Sequelize.FLOAT,
      irrigationEquipmentBrand: Sequelize.STRING,
      soilType: Sequelize.STRING,
      averageYieldPerAcre: Sequelize.FLOAT,
      sowingMonth: Sequelize.STRING,
      sowingMethod: Sequelize.STRING,
      storageFacilityAtFarm: Sequelize.BOOLEAN,
      primarySalesPoint: Sequelize.STRING,
      distanceToNearestMandi: Sequelize.STRING,
      isGradingMachineAtFarm: Sequelize.BOOLEAN,
      isShadeAtFarmGate: Sequelize.BOOLEAN,
      isUnderContractFarming: Sequelize.BOOLEAN,
      contractPercent: Sequelize.FLOAT,
      spotPercent: Sequelize.FLOAT,
      contractPartnerName: Sequelize.STRING,
      newSeedsPurchasedAnnually: Sequelize.BOOLEAN,
      reusedSeedsPercent: Sequelize.FLOAT,
      trustedSeedCompany: Sequelize.STRING,
      reasonForTrust: Sequelize.TEXT,
      preference: Sequelize.TEXT,
      contractFarmingPercent: Sequelize.FLOAT,
      soldInSpotMarketPercent: Sequelize.FLOAT,
      interestedInDigitalTrading: Sequelize.BOOLEAN,
      usesWhatsappForBusiness: Sequelize.BOOLEAN,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });

    await queryInterface.createTable('IrrigationSources', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      farmerId: {
        type: Sequelize.INTEGER,
        references: { model: 'Farmers', key: 'id' },
        onDelete: 'CASCADE',
      },
      method: Sequelize.STRING,
    });

    await queryInterface.createTable('PotatoVarietyGrown', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      farmerId: {
        type: Sequelize.INTEGER,
        references: { model: 'Farmers', key: 'id' },
        onDelete: 'CASCADE',
      },
      variety: Sequelize.STRING,
      subVariety: Sequelize.STRING,
    });

    await queryInterface.createTable('FarmEquipment', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      farmerId: {
        type: Sequelize.INTEGER,
        references: { model: 'Farmers', key: 'id' },
        onDelete: 'CASCADE',
      },
      machine: Sequelize.STRING,
      brand: Sequelize.STRING,
      model: Sequelize.STRING,
    });

    await queryInterface.createTable('TechnologyUsed', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      farmerId: {
        type: Sequelize.INTEGER,
        references: { model: 'Farmers', key: 'id' },
        onDelete: 'CASCADE',
      },
      name: Sequelize.STRING,
    });

    await queryInterface.createTable('SellingChannels', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      farmerId: {
        type: Sequelize.INTEGER,
        references: { model: 'Farmers', key: 'id' },
        onDelete: 'CASCADE',
      },
      name: Sequelize.STRING,
    });

    await queryInterface.createTable('SellingChallenges', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      farmerId: {
        type: Sequelize.INTEGER,
        references: { model: 'Farmers', key: 'id' },
        onDelete: 'CASCADE',
      },
      name: Sequelize.STRING,
    });

    await queryInterface.createTable('MajorSellingChallenges', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      farmerId: {
        type: Sequelize.INTEGER,
        references: { model: 'Farmers', key: 'id' },
        onDelete: 'CASCADE',
      },
      name: Sequelize.STRING,
    });

    await queryInterface.createTable('PriceDiscoveryMethods', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      farmerId: {
        type: Sequelize.INTEGER,
        references: { model: 'Farmers', key: 'id' },
        onDelete: 'CASCADE',
      },
      method: Sequelize.STRING,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PriceDiscoveryMethods');
    await queryInterface.dropTable('MajorSellingChallenges');
    await queryInterface.dropTable('SellingChallenges');
    await queryInterface.dropTable('SellingChannels');
    await queryInterface.dropTable('TechnologyUsed');
    await queryInterface.dropTable('FarmEquipment');
    await queryInterface.dropTable('PotatoVarietyGrown');
    await queryInterface.dropTable('IrrigationSources');
    await queryInterface.dropTable('LandDetails');
    await queryInterface.dropTable('Farmers');
  }
};
