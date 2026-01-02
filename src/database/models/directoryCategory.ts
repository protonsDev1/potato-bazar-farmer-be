import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import DirectorySubCategory from "./directorySubCategory";

class DirectoryCategory extends Model<
  InferAttributes<DirectoryCategory>,
  InferCreationAttributes<DirectoryCategory>
> {
  declare id: number;
  declare name: string;
  declare image: string | null;
  declare isActive: boolean;
  declare position: number | null;
  declare isDeleted: boolean;
  declare localizedContent: Record<
    string,
    {
      name: string;
    }
  > | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

DirectoryCategory.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    image: { type: DataTypes.STRING, allowNull: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    position: { type: DataTypes.INTEGER, allowNull: true },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    localizedContent: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "DirectoryCategory",
    tableName: "directoryCategories",
    timestamps: true,
  }
);

export default DirectoryCategory;
