import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from './db';

class UsageType extends Model<InferAttributes<UsageType>, InferCreationAttributes<UsageType>> {
  declare id: CreationOptional<number>;
  declare coldStorageId: number;
  declare type: string;
}

UsageType.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    coldStorageId: DataTypes.INTEGER,
    type: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: 'UsageType',
    tableName: 'usageTypes',
    timestamps: false,
  }
);

export default UsageType;
