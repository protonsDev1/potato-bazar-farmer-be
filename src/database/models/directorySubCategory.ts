import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import DirectoryCategory from "./directoryCategory";

class DirectorySubCategory extends Model<
  InferAttributes<DirectorySubCategory>,
  InferCreationAttributes<DirectorySubCategory>
> {
  declare id: number;
  declare categoryId: number;
  declare name: string;
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

DirectorySubCategory.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "directoryCategories",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    name: { type: DataTypes.STRING, allowNull: false },
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
    modelName: "DirectorySubCategory",
    tableName: "directorySubCategories",
    timestamps: true,
  }
);

// Associations
DirectoryCategory.hasMany(DirectorySubCategory, {
  foreignKey: "categoryId",
  as: "subCategories",
  onDelete: "CASCADE",
});

DirectorySubCategory.belongsTo(DirectoryCategory, {
  foreignKey: "categoryId",
  as: "category",
});

export default DirectorySubCategory;
