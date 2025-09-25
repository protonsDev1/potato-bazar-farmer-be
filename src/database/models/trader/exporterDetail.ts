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

class ExporterDetail extends Model<
  InferAttributes<ExporterDetail>,
  InferCreationAttributes<ExporterDetail>
> {
  declare id: CreationOptional<number>;
  declare traderId: ForeignKey<Trader["id"]>;
  declare regions: string;
  declare isCustomRegion: string;
  declare potatoVarieties: string;
  declare isCustomPotatoVariety: string;
  declare quantityPerYear: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

ExporterDetail.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    traderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: { model: "traders", key: "id" },
      onDelete: "CASCADE",
    },
    regions: { type: DataTypes.ARRAY(DataTypes.STRING) },
    isCustomRegion: { type: DataTypes.BOOLEAN, defaultValue: false },
    potatoVarieties: { type: DataTypes.ARRAY(DataTypes.STRING) },
    isCustomPotatoVariety: { type: DataTypes.BOOLEAN, defaultValue: false },
    quantityPerYear: { type: DataTypes.STRING },
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
    modelName: "ExporterDetail",
    tableName: "exporterDetails",
    timestamps: true,
  }
);

ExporterDetail.belongsTo(Trader, { foreignKey: "traderId", as: "trader" });
Trader.hasOne(ExporterDetail, { foreignKey: "traderId", as: "exporterDetail" });

export default ExporterDetail;
