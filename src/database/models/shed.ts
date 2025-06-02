import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from './db';

class Shed extends Model<InferAttributes<Shed>, InferCreationAttributes<Shed>> {
  declare id: CreationOptional<number>;
  declare coldStorageId: number;
  declare sizeSqMtr: number;
}

Shed.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    coldStorageId: DataTypes.INTEGER,
    sizeSqMtr: DataTypes.DECIMAL,
  },
  {
    sequelize,
    modelName: 'Shed',
    tableName: 'sheds',
    timestamps: false,
  }
);

export default Shed;
