'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('farmers', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: Sequelize.STRING,
      age: Sequelize.INTEGER,
      gender: Sequelize.STRING,
      mobile: Sequelize.STRING,
      whatsapp: Sequelize.STRING,

      village: Sequelize.STRING,
      taluka: Sequelize.STRING,
      district: Sequelize.STRING,
      state: {
        type: Sequelize.STRING,
        defaultValue: 'Gujarat',
      },

      hasAadhaar: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      hasBankAccount: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      land_owned_acres: Sequelize.FLOAT,
      land_leased_acres: Sequelize.FLOAT,
      potato_cultivation_acres: Sequelize.FLOAT,

      farming_type: Sequelize.STRING,

      irrigation_sources: Sequelize.ARRAY(Sequelize.STRING),
      soil_type: Sequelize.STRING,

      potato_variety: Sequelize.ARRAY(Sequelize.STRING),
      sowing_month: Sequelize.STRING,
      harvest_month: Sequelize.STRING,

      equipment_used: Sequelize.ARRAY(Sequelize.STRING),

      sale_percent: Sequelize.INTEGER,
      storage_percent: Sequelize.INTEGER,

      uses_storage: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      selling_place: Sequelize.STRING,
      distance_to_market: Sequelize.STRING,

      does_grading: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      price_decision_factors: Sequelize.ARRAY(Sequelize.STRING),
      selling_challenges: Sequelize.ARRAY(Sequelize.STRING),

      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('farmers');
  },
};
