"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {

    // Brands Table
    await queryInterface.createTable("brands", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Products Table
    await queryInterface.createTable("products", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      brand_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "brands", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Endorsements Table
    await queryInterface.createTable("endorsements", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      headline: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      // disease stored as string (not FK)
      disease: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      brand_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "brands", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "products", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      cta_text: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cta_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      start_at: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      end_at: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },

      status: {
        type: Sequelize.ENUM("draft", "approved", "paused", "archived"),
        allowNull: false,
        defaultValue: "draft",
      },

      image: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      sort_order: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("endorsements");
    await queryInterface.dropTable("products");
    await queryInterface.dropTable("brands");
  },
};
