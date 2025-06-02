import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from './db';

class ChamberCapacity extends Model<InferAttributes<ChamberCapacity>, InferCreationAttributes<ChamberCapacity>> {
  declare id: CreationOptional<number>;
  declare coldStorageId: number;
  declare chamberNumber: number;
  declare capacityMt: number;
}

ChamberCapacity.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    coldStorageId: DataTypes.INTEGER,
    chamberNumber: DataTypes.INTEGER,
    capacityMt: DataTypes.DECIMAL,
  },
  {
    sequelize,
    modelName: 'ChamberCapacity',
    tableName: 'chamberCapacities',
    timestamps: false,
  }
);

export default ChamberCapacity;
