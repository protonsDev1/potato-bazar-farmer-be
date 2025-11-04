"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("directories", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      companyName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      logo: Sequelize.STRING,
      companyType: Sequelize.STRING,
      companyTagline: Sequelize.STRING,

      contactPersonName: Sequelize.STRING,
      email: Sequelize.STRING,
      phoneNumber: Sequelize.STRING,
      whatsAppNumber: Sequelize.STRING,
      address: Sequelize.STRING,
      website: Sequelize.STRING,
      city: Sequelize.STRING,
      state: Sequelize.STRING,
      pinCode: Sequelize.STRING,

      companyShortDescription: Sequelize.STRING,
      companyProfile: Sequelize.TEXT,
      yearEstablished: Sequelize.STRING,
      numberOfEmployees: Sequelize.STRING,
      keyCapabilities: Sequelize.TEXT,
      industriesServed: Sequelize.ARRAY(Sequelize.STRING),

      products: Sequelize.ARRAY(Sequelize.STRING),
      productDescription: Sequelize.TEXT,
      applicationAreas: Sequelize.TEXT,
      tags: Sequelize.ARRAY(Sequelize.STRING),

      subsidiaries: Sequelize.TEXT,
      strategicPartnerships: Sequelize.TEXT,
      certifications: Sequelize.STRING,

      status: { type: Sequelize.STRING, defaultValue: "pending" },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      onBoardedBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.createTable("directoryMedia", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      directoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: "directories",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      images: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      videos: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      brochures: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.createTable("directorySocialMedia", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      directoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: "directories",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      linkedInUrl: Sequelize.STRING,
      facebookUrl: Sequelize.STRING,
      twitterUrl: Sequelize.STRING,
      youtubeUrl: Sequelize.STRING,
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.createTable("directoryCategoryMappings", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      directoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "directories",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "directoryCategories",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      subCategoryId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "directorySubCategories",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.addIndex("directoryCategoryMappings", ["directoryId"]);
    await queryInterface.addIndex("directoryCategoryMappings", ["categoryId"]);
    await queryInterface.addIndex("directoryCategoryMappings", [
      "subCategoryId",
    ]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("directoryCategoryMappings");
    await queryInterface.dropTable("directoryMedia");
    await queryInterface.dropTable("directorySocialMedia");
    await queryInterface.dropTable("directories");
  },
};
