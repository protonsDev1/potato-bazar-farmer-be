import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";

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

export default SlabWiseDiscount;
