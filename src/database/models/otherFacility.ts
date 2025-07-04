import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";

class OtherFacility extends Model<
  InferAttributes<OtherFacility>,
  InferCreationAttributes<OtherFacility>
> {
  declare id: CreationOptional<number>;
  declare coldStorageId: number;
  declare facility: string | null;
}

OtherFacility.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    coldStorageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "coldStorages", key: "id" },
      onDelete: "CASCADE",
    },
    facility: {type: DataTypes.STRING, allowNull:true},
  },
  {
    sequelize,
    modelName: "OtherFacility",
    tableName: "otherFacilities",
    timestamps: true,
  }
);

export default OtherFacility;
