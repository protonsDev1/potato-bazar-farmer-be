import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import Farmer from "./farmer";

class SellingPlace extends Model<
  InferAttributes<SellingPlace>,
  InferCreationAttributes<SellingPlace>
> {
  declare id: CreationOptional<number>;
  declare farmerId: number;
  declare place: string;
}

SellingPlace.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    farmerId: {
      type: DataTypes.INTEGER,
      references: { model: "Farmers", key: "id" },
      onDelete: "CASCADE",
      allowNull: false,
    },
    place: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize,
    modelName: "SellingPlace",
    tableName: "sellingPlaces",
    timestamps: true,
    indexes: [{ fields: ["farmerId"] }],
  }
);

Farmer.hasMany(SellingPlace, { foreignKey: "farmerId" });
SellingPlace.belongsTo(Farmer, { foreignKey: "farmerId" });

export default SellingPlace;
