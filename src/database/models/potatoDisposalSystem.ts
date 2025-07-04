import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";

class PotatoDisposalSystem extends Model<
  InferAttributes<PotatoDisposalSystem>,
  InferCreationAttributes<PotatoDisposalSystem>
> {
  declare id: CreationOptional<number>;
  declare coldStorageId: number;
  declare disposalSystem: string | null;
}

PotatoDisposalSystem.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    coldStorageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "coldStorages", key: "id" },
      onDelete: "CASCADE",
    },
    disposalSystem: { type: DataTypes.STRING, allowNull: true },
  },
  {
    sequelize,
    modelName: "PotatoDisposalSystem",
    tableName: "potatoDisposalSystems",
    timestamps: true,
  }
);

export default PotatoDisposalSystem;
