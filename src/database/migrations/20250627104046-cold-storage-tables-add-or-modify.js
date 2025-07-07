"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    //ColdStorageTypes
    await queryInterface.createTable("coldStorageTypes", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      coldStorageId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "coldStorages",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      coldStorageType: {
        type: Sequelize.STRING,
        allowNull: true,
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

    //ConstructionType
    await queryInterface.createTable("constructionTypes", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      coldStorageId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "coldStorages",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      constructionType: {
        type: Sequelize.STRING,
        allowNull: true,
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

    //RoofType
    await queryInterface.createTable("roofTypes", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      coldStorageId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "coldStorages",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      roofType: {
        type: Sequelize.STRING,
        allowNull: true,
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

    //SlabWiseDiscount
    await queryInterface.createTable("slabWiseDiscounts", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      coldStorageId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "coldStorages",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      quantityInMt: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      discount: {
        type: Sequelize.DECIMAL,
        allowNull: true,
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

    //SeasonWiseStorageSystem
    await queryInterface.createTable("seasonWiseBookingSystems", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      coldStorageId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "coldStorages",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      season: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      quantityInKg: {
        type: Sequelize.DECIMAL,
        allowNull: true,
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

    //StorageBookingSystem
    await queryInterface.createTable("storageBookingSystems", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      coldStorageId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "coldStorages",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      bookingSystem: {
        type: Sequelize.STRING,
        allowNull: true,
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

    //DryingFacilityDetails
    await queryInterface.createTable("dryingFacilityDetails", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      coldStorageId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "coldStorages",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      facility: {
        type: Sequelize.STRING,
        allowNull: true,
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

    //FeatureOfStorage
    await queryInterface.createTable("featureOfStorage", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      coldStorageId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "coldStorages",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      feature: {
        type: Sequelize.STRING,
        allowNull: true,
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

    //MonitoringFacility
    await queryInterface.createTable("monitoringFacilities", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      coldStorageId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "coldStorages",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      facility: {
        type: Sequelize.STRING,
        allowNull: true,
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

    //OtherFacility
    await queryInterface.createTable("otherFacilities", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      coldStorageId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "coldStorages",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      facility: {
        type: Sequelize.STRING,
        allowNull: true,
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

    //PotatoDisposalSystem
    await queryInterface.createTable("potatoDisposalSystems", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      coldStorageId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "coldStorages",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      disposalSystem: {
        type: Sequelize.STRING,
        allowNull: true,
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

    //PowerFacility
    await queryInterface.createTable("powerFacilities", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      coldStorageId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "coldStorages",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      facility: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      capacityInKw: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      backupInHrs: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },

      make: {
        type: Sequelize.STRING,
        allowNull: true,
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

    //added fields in chamberCapacity and removed chamberNumber
    await Promise.all([
      queryInterface.removeColumn("chamberCapacities", "chamberNumber"),

      queryInterface.addColumn("chamberCapacities", "noOfFloors", {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
      queryInterface.addColumn("chamberCapacities", "sizePerChamberSqft", {
        type: Sequelize.DECIMAL,
        allowNull: true,
      }),
      queryInterface.addColumn("chamberCapacities", "description", {
        type: Sequelize.STRING,
        allowNull: true,
      }),

      queryInterface.addColumn("chamberCapacities", "createdAt", {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      }),
      queryInterface.addColumn("chamberCapacities", "updatedAt", {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      }),
    ]);

    //added fields in Shed
    await Promise.all([
      queryInterface.addColumn("sheds", "shedType", {
        type: Sequelize.STRING,
        allowNull: true,
      }),

      queryInterface.addColumn("sheds", "createdAt", {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      }),
      queryInterface.addColumn("sheds", "updatedAt", {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      }),
    ]);

    // change fields in Usage Types
    await Promise.all([
      queryInterface.addColumn("usageTypes", "capacity", {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
      queryInterface.addColumn("usageTypes", "createdAt", {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      }),
      queryInterface.addColumn("usageTypes", "updatedAt", {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      }),
    ]);

    // changed fields in operational challenges
    await Promise.all([
      queryInterface.addColumn("operationalChallenges", "createdAt", {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      }),
      queryInterface.addColumn("operationalChallenges", "updatedAt", {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      }),
    ]);

    // AdminStorageBookingSystem
    await queryInterface.createTable("adminStorageBookingSystems", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      position: {
        type: Sequelize.INTEGER,
        allowNull: true,
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

    //added fields in ColdStorage
    await Promise.all([
      queryInterface.addColumn("coldStorages", "whatsappNumber", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("coldStorages", "taluka", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("coldStorages", "pinCode", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("coldStorages", "digiPin", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("coldStorages", "gradingAreaSqft", {
        type: Sequelize.DECIMAL,
        allowNull: true,
      }),
      queryInterface.addColumn("coldStorages", "gradingMachineAvailable", {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      }),
      queryInterface.addColumn("coldStorages", "manualGradingAreaAvailable", {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      }),
      queryInterface.addColumn("coldStorages", "numberOfKattas", {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
      queryInterface.addColumn("coldStorages", "monitoringLogAvailable", {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      }),
      queryInterface.addColumn("coldStorages", "realTimeAlertSystem", {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      }),
      queryInterface.addColumn("coldStorages", "weighBridge", {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      }),
      queryInterface.addColumn("coldStorages", "numberOfTrucks", {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
      queryInterface.addColumn("coldStorages", "noOfLabourInPeakSeason", {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
      queryInterface.addColumn("coldStorages", "gradingAreaAvailable", {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      }),
      queryInterface.addColumn("coldStorages", "isSlabWiseDiscount", {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      }),
      queryInterface.addColumn("coldStorages", "photos", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("coldStorages", "awardOrCertificate", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("dryingFacilityDetails");
    await queryInterface.dropTable("featureOfStorage");
    await queryInterface.dropTable("monitoringFacilities");
    await queryInterface.dropTable("otherFacilities");
    await queryInterface.dropTable("potatoDisposalSystems");
    await queryInterface.dropTable("powerFacilities");
    await queryInterface.dropTable("slabWiseDiscounts");
    await queryInterface.dropTable("storageBookingSystems");
    await queryInterface.dropTable("seasonWiseBookingSystems");
    await queryInterface.dropTable("coldStorageTypes");
    await queryInterface.dropTable("constructionTypes");
    await queryInterface.dropTable("roofTypes");
    await queryInterface.dropTable("adminStorageBookingSystems");
    await queryInterface.addColumn("chamberCapacities", "chamberNumber", {
      type: Sequelize.INTEGER,
    }),
      await Promise.all([
        queryInterface.removeColumn("chamberCapacities", "noOfFloors"),
        queryInterface.removeColumn("chamberCapacities", "sizePerChamberSqft"),
        queryInterface.removeColumn("chamberCapacities", "description"),
        queryInterface.removeColumn("chamberCapacities", "createdAt"),
        queryInterface.removeColumn("chamberCapacities", "updatedAt"),
      ]);

    await Promise.all([
      queryInterface.removeColumn("sheds", "shedType"),
      queryInterface.removeColumn("sheds", "createdAt"),
      queryInterface.removeColumn("sheds", "updatedAt"),
    ]);

    await Promise.all([
      queryInterface.removeColumn("usageTypes", "capacity"),
      queryInterface.removeColumn("usageTypes", "createdAt"),
      queryInterface.removeColumn("usageTypes", "updatedAt"),
    ]);

    await Promise.all([
      queryInterface.removeColumn("operationalChallenges", "createdAt"),
      queryInterface.removeColumn("operationalChallenges", "updatedAt"),
    ]);

    await Promise.all([
      queryInterface.removeColumn("coldStorages", "whatsappNumber"),
      queryInterface.removeColumn("coldStorages", "taluka"),
      queryInterface.removeColumn("coldStorages", "pinCode"),
      queryInterface.removeColumn("coldStorages", "digiPin"),
      queryInterface.removeColumn("coldStorages", "gradingAreaSqft"),
      queryInterface.removeColumn("coldStorages", "gradingMachineAvailable"),
      queryInterface.removeColumn("coldStorages", "manualGradingAreaAvailable"),
      queryInterface.removeColumn("coldStorages", "numberOfKattas"),
      queryInterface.removeColumn("coldStorages", "monitoringLogAvailable"),
      queryInterface.removeColumn("coldStorages", "realTimeAlertSystem"),
      queryInterface.removeColumn("coldStorages", "weighBridge"),
      queryInterface.removeColumn("coldStorages", "numberOfTrucks"),
      queryInterface.removeColumn("coldStorages", "noOfLabourInPeakSeason"),
      queryInterface.removeColumn("coldStorages", "gradingAreaAvailable"),
      queryInterface.removeColumn("coldStorages", "isSlabWiseDiscount"),
      queryInterface.removeColumn("coldStorages", "awardOrCertificate"),
      queryInterface.removeColumn("coldStorages", "photos"),
    ]);
  },
};
