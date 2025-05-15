import { Model, DataTypes } from 'sequelize';
import sequelize from './db'; // adjust path to your db instance

class Farmer extends Model {}

Farmer.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: DataTypes.STRING,
  age: DataTypes.INTEGER,
  gender: DataTypes.STRING,
  mobile: DataTypes.STRING,
  whatsapp: DataTypes.STRING,

  village: DataTypes.STRING,
  taluka: DataTypes.STRING,
  district: DataTypes.STRING,
  state: {
    type: DataTypes.STRING,
    defaultValue: 'Gujarat',
  },

  hasAadhaar: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  hasBankAccount: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  land_owned_acres: DataTypes.FLOAT,
  land_leased_acres: DataTypes.FLOAT,
  potato_cultivation_acres: DataTypes.FLOAT,

  farming_type: DataTypes.STRING, 

  irrigation_sources: DataTypes.ARRAY(DataTypes.STRING), 
  soil_type: DataTypes.STRING, 

  potato_variety: DataTypes.ARRAY(DataTypes.STRING),
  sowing_month: DataTypes.STRING,
  harvest_month: DataTypes.STRING,

  equipment_used: DataTypes.ARRAY(DataTypes.STRING), 

  sale_percent: DataTypes.INTEGER,
  storage_percent: DataTypes.INTEGER,

  uses_storage: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  selling_place: DataTypes.STRING, 
  distance_to_market: DataTypes.STRING,

  does_grading: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  price_decision_factors: DataTypes.ARRAY(DataTypes.STRING),
  selling_challenges: DataTypes.ARRAY(DataTypes.STRING),

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
  modelName: 'Farmer',
  tableName: 'farmers',
  timestamps: true,
});

export default Farmer;
