import { Model, DataTypes } from "sequelize";
import sequelize from "./db";

class Brand extends Model {
  declare id: number;
  declare name: string;
  declare localizedContent: Record<
    string,
    {
      name: string;
      dateText: object;
    }
  > | null;
}

Brand.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    localizedContent: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Brand",
    tableName: "brands",
    timestamps: true,
  }
);

export default Brand;
