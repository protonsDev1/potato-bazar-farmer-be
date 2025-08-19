import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";

class SeedBrandName extends Model<
  InferAttributes<SeedBrandName>,
  InferCreationAttributes<SeedBrandName>
> {
  declare id: CreationOptional<number>;
  declare farmerId: number;
  declare name: string | null;
  declare isCustom: boolean;
}

SeedBrandName.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    farmerId: {
      type: DataTypes.INTEGER,
      references: { model: "Farmers", key: "id" },
      onDelete: "CASCADE",
      allowNull: false,
    },
    name: { type: DataTypes.STRING, allowNull: true },
    isCustom: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    sequelize,
    modelName: "SeedBrandName",
    tableName: "seedBrandNames",
    timestamps: false,
    indexes: [{ fields: ["farmerId"] }],
  }
);

export default SeedBrandName;
