import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import ColdStorage from "./coldStorage";

class SeasonWiseBookingSystem extends Model<
  InferAttributes<SeasonWiseBookingSystem>,
  InferCreationAttributes<SeasonWiseBookingSystem>
> {
  declare id: CreationOptional<number>;
  declare coldStorageId: number;
  declare season: string | null;
  declare monthTo: string | null;
  declare monthFrom: string | null;
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
    monthTo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    monthFrom: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    quantityInKg: { type: DataTypes.DECIMAL, allowNull: true },
  },
  {
    sequelize,
    modelName: "SeasonWiseBookingSystem",
    tableName: "seasonWiseBookingSystems",
    timestamps: true,
  }
);

SeasonWiseBookingSystem.belongsTo(ColdStorage, {
  foreignKey: "coldStorageId",
  as: "coldStorage",
});
ColdStorage.hasMany(SeasonWiseBookingSystem, {
  foreignKey: "coldStorageId",
  as: "seasonWiseBookingSystems",
});

export default SeasonWiseBookingSystem;
