import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from "sequelize";
import sequelize from "../db";
import Trader from "./trader";

class ProcurementRegion extends Model<
  InferAttributes<ProcurementRegion>,
  InferCreationAttributes<ProcurementRegion>
> {
  declare id: CreationOptional<number>;
  declare traderId: ForeignKey<Trader["id"]>;
  declare name: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

ProcurementRegion.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    traderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "traders", key: "id" },
      onDelete: "CASCADE",
    },
    name: { type: DataTypes.STRING, allowNull: false },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "ProcurementRegion",
    tableName: "procurementRegions",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["traderId", "name"],
      },
    ],
  }
);

ProcurementRegion.belongsTo(Trader, { foreignKey: "traderId", as: "trader" });
Trader.hasMany(ProcurementRegion, {
  foreignKey: "traderId",
  as: "procurementRegions",
});

export default ProcurementRegion;
