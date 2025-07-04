import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";

class StorageBookingSystem extends Model<
  InferAttributes<StorageBookingSystem>,
  InferCreationAttributes<StorageBookingSystem>
> {
  declare id: CreationOptional<number>;
  declare coldStorageId: number;
  declare bookingSystem: string | null;
}

StorageBookingSystem.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    coldStorageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "coldStorages", key: "id" },
      onDelete: "CASCADE",
    },
    bookingSystem: { type: DataTypes.STRING, allowNull: true },
  },
  {
    sequelize,
    modelName: "StorageBookingSystem",
    tableName: "storageBookingSystems",
    timestamps: true,
  }
);

export default StorageBookingSystem;
