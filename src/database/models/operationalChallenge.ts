import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from './db';

class OperationalChallenge extends Model<InferAttributes<OperationalChallenge>, InferCreationAttributes<OperationalChallenge>> {
  declare id: CreationOptional<number>;
  declare coldStorageId: number;
  declare challenge: string;
}

OperationalChallenge.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    coldStorageId: DataTypes.INTEGER,
    challenge: DataTypes.TEXT,
  },
  {
    sequelize,
    modelName: 'OperationalChallenge',
    tableName: 'operationalChallenges',
    timestamps: false,
  }
);

export default OperationalChallenge;
