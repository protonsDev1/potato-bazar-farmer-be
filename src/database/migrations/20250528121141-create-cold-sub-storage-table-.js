module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('coldStorages', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      name: Sequelize.STRING,
      ownerName: Sequelize.STRING,
      mobileNumber: Sequelize.STRING,
      optionalNumber: Sequelize.STRING,
      village: Sequelize.STRING,
      district: Sequelize.STRING,
      geoLocation: Sequelize.STRING,
      hasGstCertificate: Sequelize.BOOLEAN,
      gstOrCertificateNumber: Sequelize.STRING,
      totalCapacityMt: Sequelize.DECIMAL,
      builtYear: Sequelize.INTEGER,
      constructionType: Sequelize.STRING,
      roofType: Sequelize.STRING,
      numberOfChambers: Sequelize.INTEGER,
      floorsPerChamber: Sequelize.INTEGER,
      chamberWiseCapacityMt: Sequelize.TEXT,
      numberOfSheds: Sequelize.INTEGER,
      shedSize: Sequelize.STRING,
      antiChamberSizeCapacity: Sequelize.TEXT,
      totalArea: Sequelize.STRING,
      hasAirCutter: Sequelize.BOOLEAN,
      hasInsectTrap: Sequelize.BOOLEAN,
      gradingBookingAvailable: Sequelize.BOOLEAN,
      gradingMachineMake: Sequelize.STRING,
      gradingMachineTph: Sequelize.DECIMAL,
      dryingFloorCapacityKatta: Sequelize.INTEGER,
      bookingMode: Sequelize.STRING,
      coldStorageType: Sequelize.STRING,
      co2Controller: Sequelize.STRING,
      humidityController: Sequelize.STRING,
      temperatureController: Sequelize.STRING,
      refrigerationType: Sequelize.STRING,
      refrigerationMake: Sequelize.STRING,
      machineCount: Sequelize.INTEGER,
      machineCapacity: Sequelize.DECIMAL,
      machineMake: Sequelize.STRING,
      hasAmmoniaDetector: Sequelize.BOOLEAN,
      hasRemoteMonitoring: Sequelize.BOOLEAN,
      hasWebCamera: Sequelize.BOOLEAN,
      hasGuestStay: Sequelize.BOOLEAN,
      hasGuestMeals: Sequelize.BOOLEAN,
      weighbridgeCapacityLength: Sequelize.STRING,
      hasLorryShades: Sequelize.BOOLEAN,
      lorryShadeCapacity: Sequelize.INTEGER,
      accessibility: Sequelize.TEXT,
      hasLabourForGrading: Sequelize.BOOLEAN,
      potatoDisposalMethod: Sequelize.TEXT,
      solarPowerCapacityKw: Sequelize.DECIMAL,
      backupPowerCapacityKw: Sequelize.DECIMAL,
      uniqueFeatures: Sequelize.TEXT,
      tradeMode: Sequelize.ENUM('yesTradeOnly', 'noRentalOnly', 'bothTradeAndRent'),
      isContractFarming: Sequelize.BOOLEAN,
      contractFarmingDetails: Sequelize.TEXT,
      transportProvided: Sequelize.BOOLEAN,
      willingOnlineAuction: Sequelize.BOOLEAN,
      additionalComments: Sequelize.TEXT,
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    await queryInterface.createTable('storageTypes', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      coldStorageId: {
        type: Sequelize.INTEGER,
        references: { model: 'coldStorages', key: 'id' },
        onDelete: 'CASCADE'
      },
      storageType: Sequelize.STRING
    });

    await queryInterface.createTable('usageTypes', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      coldStorageId: {
        type: Sequelize.INTEGER,
        references: { model: 'coldStorages', key: 'id' },
        onDelete: 'CASCADE'
      },
      type: Sequelize.STRING
    });

    await queryInterface.createTable('operationalChallenges', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      coldStorageId: {
        type: Sequelize.INTEGER,
        references: { model: 'coldStorages', key: 'id' },
        onDelete: 'CASCADE'
      },
      challenge: Sequelize.TEXT
    });

    await queryInterface.createTable('elevatorsAndStuffing', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      coldStorageId: {
        type: Sequelize.INTEGER,
        references: { model: 'coldStorages', key: 'id' },
        onDelete: 'CASCADE'
      },
      name: Sequelize.STRING
    });

    await queryInterface.createTable('chamberCapacities', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      coldStorageId: {
        type: Sequelize.INTEGER,
        references: { model: 'coldStorages', key: 'id' },
        onDelete: 'CASCADE'
      },
      chamberNumber: Sequelize.INTEGER,
      capacityMt: Sequelize.DECIMAL
    });

    await queryInterface.createTable('sheds', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      coldStorageId: {
        type: Sequelize.INTEGER,
        references: { model: 'coldStorages', key: 'id' },
        onDelete: 'CASCADE'
      },
      sizeSqMtr: Sequelize.DECIMAL
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sheds');
    await queryInterface.dropTable('chamberCapacities');
    await queryInterface.dropTable('elevatorsAndStuffing');
    await queryInterface.dropTable('operationalChallenges');
    await queryInterface.dropTable('usageTypes');
    await queryInterface.dropTable('storageTypes');
    await queryInterface.dropTable('coldStorages');
  }
};
