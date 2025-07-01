import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import Farmer from "./farmer";

class BrandPreferenceReason extends Model<
  InferAttributes<BrandPreferenceReason>,
  InferCreationAttributes<BrandPreferenceReason>
> {
  declare id: CreationOptional<number>;
  declare farmerId: number;
  declare reason: string;
}

BrandPreferenceReason.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    farmerId: {
      type: DataTypes.INTEGER,
      references: { model: "Farmers", key: "id" },
      onDelete: "CASCADE",
      allowNull: false,
    },
    reason: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize,
    modelName: "BrandPreferenceReason",
    tableName: "brandPreferenceReasons",
    timestamps: true,
    indexes: [{ fields: ["farmerId"] }],
  }
);

Farmer.hasMany(BrandPreferenceReason, { foreignKey: "farmerId" });
BrandPreferenceReason.belongsTo(Farmer, { foreignKey: "farmerId" });

export default BrandPreferenceReason;
