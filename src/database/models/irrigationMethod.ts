import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import Farmer from "./farmer";

class IrrigationMethod extends Model<
  InferAttributes<IrrigationMethod>,
  InferCreationAttributes<IrrigationMethod>
> {
  declare id: CreationOptional<number>;
  declare farmerId: number;
  declare method: string;
}

IrrigationMethod.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    farmerId: {
      type: DataTypes.INTEGER,
      references: { model: "Farmers", key: "id" },
      onDelete: "CASCADE",
      allowNull: false,
    },
    method: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize,
    modelName: "IrrigationMethod",
    tableName: "irrigationMethods",
    timestamps: true,
    indexes: [{ fields: ["farmerId"] }],
  }
);

Farmer.hasMany(IrrigationMethod, { foreignKey: "farmerId" });
IrrigationMethod.belongsTo(Farmer, { foreignKey: "farmerId" });

export default IrrigationMethod;
