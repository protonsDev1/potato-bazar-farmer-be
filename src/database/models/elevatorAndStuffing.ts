import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from './db';

class ElevatorAndStuffing extends Model<InferAttributes<ElevatorAndStuffing>, InferCreationAttributes<ElevatorAndStuffing>> {
  declare id: CreationOptional<number>;
  declare coldStorageId: number;
  declare name: string;
}

ElevatorAndStuffing.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    coldStorageId: DataTypes.INTEGER,
    name: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: 'ElevatorAndStuffing',
    tableName: 'elevatorsAndStuffing',
    timestamps: false,
  }
);

export default ElevatorAndStuffing;
