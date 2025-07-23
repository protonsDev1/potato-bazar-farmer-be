import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import ColdStorage from "./coldStorage";

class Shed extends Model<InferAttributes<Shed>, InferCreationAttributes<Shed>> {
  declare id: CreationOptional<number>;
  declare coldStorageId: number;
  declare sizeSqMtr: number | null;
  declare shedType: string | null;
}

Shed.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    coldStorageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "coldStorages", key: "id" },
      onDelete: "CASCADE",
    },
    sizeSqMtr: { type: DataTypes.DECIMAL, allowNull: true },
    shedType: { type: DataTypes.STRING, allowNull: true },
  },
  {
    sequelize,
    modelName: "Shed",
    tableName: "sheds",
    timestamps: true,
  }
);

Shed.belongsTo(ColdStorage, {
  foreignKey: "coldStorageId",
  as: "coldStorage",
});
ColdStorage.hasMany(Shed, {
  foreignKey: "coldStorageId",
  as: "sheds",
});

export default Shed;
