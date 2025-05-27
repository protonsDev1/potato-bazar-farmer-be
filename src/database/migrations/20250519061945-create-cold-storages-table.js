'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cold_storages', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      owner_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      contact_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      whatsapp_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      village: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      district: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      state: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Gujarat',
      },

      gst_available: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      gst_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      total_capacity_mt: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      storage_meant_for: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      storage_type: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      built_year: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      construction_type: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      temperature_control: Sequelize.BOOLEAN,
      humidity_control: Sequelize.BOOLEAN,
      power_backup: Sequelize.BOOLEAN,
      internet_connectivity: Sequelize.BOOLEAN,
      video_surveillance: Sequelize.BOOLEAN,

      transport_available: Sequelize.BOOLEAN,
      market_distance_km: Sequelize.FLOAT,
      market_linkage: {
        type: Sequelize.STRING,
        allowNull: true,
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('cold_storages');
  }
};
