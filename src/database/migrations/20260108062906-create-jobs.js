"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("jobs", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      educationLevel: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      skillsRequired: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      experienceRequired: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      workplace: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      vacancies: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      salaryMin: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      salaryMax: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      additionalBenefit: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      joiningTimeline: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      state: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      district: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      pincode: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      companyName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      mobile: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      whatsAppContact: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      alternateMobile: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      document: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "pending",
      },
      reason: {
        type: Sequelize.TEXT,
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("jobs");
  },
};
