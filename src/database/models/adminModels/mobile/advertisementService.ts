import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import sequelize from "../../db";

class AdvertisementService extends Model<
  InferAttributes<AdvertisementService>,
  InferCreationAttributes<AdvertisementService>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare subName: string;
  declare isActive: boolean;
  declare position: number;
  declare isDeleted: boolean;
}

AdvertisementService.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    subName: { type: DataTypes.STRING, allowNull: true },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "AdvertisementService",
    tableName: "advertisementServices",
    timestamps: true,
  }
);

export default AdvertisementService;
