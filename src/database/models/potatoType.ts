import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";

class PotatoType extends Model<
  InferAttributes<PotatoType>,
  InferCreationAttributes<PotatoType>
> {
  declare id: CreationOptional<number>;
  declare farmerId: number;
  declare type: string | null;
}

PotatoType.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    farmerId: {
      type: DataTypes.INTEGER,
      references: { model: "Farmers", key: "id" },
      onDelete: "CASCADE",
      allowNull: false,
    },
    type: { type: DataTypes.STRING, allowNull: true },
  },
  {
    sequelize,
    modelName: "PotatoType",
    tableName: "potatoTypes",
    timestamps: true,
    indexes: [{ fields: ["farmerId"] }],
  }
);

export default PotatoType;
