import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";

class SeasonWiseBookingSystem extends Model<
  InferAttributes<SeasonWiseBookingSystem>,
  InferCreationAttributes<SeasonWiseBookingSystem>
> {
  declare id: CreationOptional<number>;
  declare coldStorageId: number;
  declare season: string | null;
  declare quantityInKg: number | null;
}

SeasonWiseBookingSystem.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    coldStorageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "coldStorages", key: "id" },
      onDelete: "CASCADE",
    },
    season: { type: DataTypes.STRING, allowNull: true },
    quantityInKg: { type: DataTypes.DECIMAL, allowNull: true },
  },
  {
    sequelize,
    modelName: "SeasonWiseBookingSystem",
    tableName: "seasonWiseBookingSystems",
    timestamps: true,
  }
);

export default SeasonWiseBookingSystem;
