import { Model, DataTypes } from 'sequelize';
import sequelize from './db'; 

class ColdStorage extends Model {}

ColdStorage.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  name: DataTypes.STRING,
  owner_name: DataTypes.STRING,
  contact_number: DataTypes.STRING,
  whatsapp_number: DataTypes.STRING,

  village: DataTypes.STRING,
  district: DataTypes.STRING,
  state: {
    type: DataTypes.STRING,
    defaultValue: 'Gujarat',
  },

  gst_available: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  gst_number: DataTypes.STRING,

  total_capacity_mt: DataTypes.FLOAT,
  storage_meant_for: DataTypes.ARRAY(DataTypes.STRING),
  storage_type: DataTypes.ARRAY(DataTypes.STRING),
  built_year: DataTypes.INTEGER,
  construction_type: DataTypes.STRING,

  temperature_control: DataTypes.BOOLEAN,
  humidity_control: DataTypes.BOOLEAN,
  power_backup: DataTypes.BOOLEAN,
  internet_connectivity: DataTypes.BOOLEAN,
  video_surveillance: DataTypes.BOOLEAN,

  transport_available: DataTypes.BOOLEAN,
  market_distance_km: DataTypes.FLOAT,
  market_linkage: DataTypes.STRING,
  onBoardedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },

  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  modelName: 'ColdStorage',
  tableName: 'cold_storages',
  timestamps: true,
});

export default ColdStorage;
