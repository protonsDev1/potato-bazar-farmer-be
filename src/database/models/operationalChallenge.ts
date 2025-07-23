import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import ColdStorage from "./coldStorage";

class OperationalChallenge extends Model<
  InferAttributes<OperationalChallenge>,
  InferCreationAttributes<OperationalChallenge>
> {
  declare id: CreationOptional<number>;
  declare coldStorageId: number;
  declare challenge: string | null;
}

OperationalChallenge.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    coldStorageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "coldStorages", key: "id" },
      onDelete: "CASCADE",
    },
    challenge: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    sequelize,
    modelName: "OperationalChallenge",
    tableName: "operationalChallenges",
    timestamps: true,
  }
);

OperationalChallenge.belongsTo(ColdStorage, {
  foreignKey: "coldStorageId",
  as: "coldStorage",
});
ColdStorage.hasMany(OperationalChallenge, {
  foreignKey: "coldStorageId",
  as: "operationalChallenges",
});
export default OperationalChallenge;
