import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import ColdStorage from "./coldStorage";

class DryingFacilityDetail extends Model<
  InferAttributes<DryingFacilityDetail>,
  InferCreationAttributes<DryingFacilityDetail>
> {
  declare id: CreationOptional<number>;
  declare coldStorageId: number;
  declare facility: string | null;
}

DryingFacilityDetail.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    coldStorageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "coldStorages", key: "id" },
      onDelete: "CASCADE",
    },
    facility: { type: DataTypes.STRING, allowNull: true },
  },
  {
    sequelize,
    modelName: "DryingFacilityDetail",
    tableName: "dryingFacilityDetails",
    timestamps: true,
  }
);

DryingFacilityDetail.belongsTo(ColdStorage, {
  foreignKey: "coldStorageId",
  as: "coldStorage",
});
ColdStorage.hasMany(DryingFacilityDetail, {
  foreignKey: "coldStorageId",
  as: "dryingFacilityDetails",
});

export default DryingFacilityDetail;
