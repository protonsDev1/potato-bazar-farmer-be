import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import sequelize from './db';

class Farmer extends Model<InferAttributes<Farmer>, InferCreationAttributes<Farmer>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare age: number;
  declare gender: string;
  declare optionalNumber: string | null;
  declare caste: string | null;
  declare subCaste: string | null;
  declare village: string | null;
  declare taluka: string | null;
  declare district: string | null;
  declare state: string | null;
  declare geoLocation: string | null;
  declare isAadhaarCard: boolean | null;
  declare aadhaarNumber: string | null;
  declare isBankAccount: boolean | null;
  declare onBoardedBy: number | null;
  declare userId: number | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Farmer.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    age: { type: DataTypes.INTEGER, allowNull: false },
    gender: { type: DataTypes.STRING, allowNull: false },
    optionalNumber: { type: DataTypes.STRING, allowNull: true },
    caste: { type: DataTypes.STRING, allowNull: true },
    subCaste: { type: DataTypes.STRING, allowNull: true },
    village: { type: DataTypes.STRING, allowNull: true },
    taluka: { type: DataTypes.STRING, allowNull: true },
    district: { type: DataTypes.STRING, allowNull: true },
    state: { type: DataTypes.STRING, allowNull: true },
    geoLocation: { type: DataTypes.STRING, allowNull: true },
    isAadhaarCard: { type: DataTypes.BOOLEAN, allowNull: true },
    aadhaarNumber: { type: DataTypes.STRING, allowNull: true },
    isBankAccount: { type: DataTypes.BOOLEAN, allowNull: true },
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
    userId:{
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    modelName: 'Farmer',
    tableName: 'Farmers',
    timestamps: true,
  }
);

export default Farmer;
