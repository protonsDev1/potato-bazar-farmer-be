import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import ColdStorage from "./coldStorage";

class SlabWiseDiscount extends Model<
  InferAttributes<SlabWiseDiscount>,
  InferCreationAttributes<SlabWiseDiscount>
> {
  declare id: CreationOptional<number>;
  declare coldStorageId: number;
  declare quantityInMt: number | null;
  declare discount: number | null;
}

SlabWiseDiscount.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    coldStorageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "coldStorages", key: "id" },
      onDelete: "CASCADE",
    },
    quantityInMt: { type: DataTypes.DECIMAL, allowNull: true },
    discount: { type: DataTypes.DECIMAL, allowNull: true },
  },
  {
    sequelize,
    modelName: "SlabWiseDiscount",
    tableName: "slabWiseDiscounts",
    timestamps: true,
  }
);

SlabWiseDiscount.belongsTo(ColdStorage, {
  foreignKey: "coldStorageId",
  as: "coldStorage",
});
ColdStorage.hasMany(SlabWiseDiscount, {
  foreignKey: "coldStorageId",
  as: "slabWiseDiscounts",
});

export default SlabWiseDiscount;
