import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import Farmer from "./farmer";

class OtherCropGrown extends Model<
  InferAttributes<OtherCropGrown>,
  InferCreationAttributes<OtherCropGrown>
> {
  declare id: CreationOptional<number>;
  declare farmerId: number;
  declare cropName: string;
  declare sowingMonth: string;
  declare harvestingMonth: string;
}

OtherCropGrown.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    farmerId: {
      type: DataTypes.INTEGER,
      references: { model: "Farmers", key: "id" },
      onDelete: "CASCADE",
      allowNull: false,
    },
    cropName: { type: DataTypes.STRING, allowNull: false },
    sowingMonth: { type: DataTypes.STRING, allowNull: false },
    harvestingMonth: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize,
    modelName: "OtherCropGrown",
    tableName: "otherCropsGrown",
    timestamps: true,
    indexes: [{ fields: ["farmerId"] }],
  }
);

Farmer.hasMany(OtherCropGrown, { foreignKey: "farmerId" });
OtherCropGrown.belongsTo(Farmer, { foreignKey: "farmerId" });

export default OtherCropGrown;
