import { Model, DataTypes } from "sequelize";
import sequelize from "./db";
import Directory from "./directory";
import DirectoryCategory from "./directoryCategory";
import DirectorySubCategory from "./directorySubCategory";

class DirectoryCategoryMapping extends Model {}

DirectoryCategoryMapping.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    directoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "directories",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "directoryCategories",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    subCategoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "directorySubCategories",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "DirectoryCategoryMapping",
    tableName: "directoryCategoryMappings",
    timestamps: true,
    indexes: [
      { fields: ["directoryId"] },
      { fields: ["categoryId"] },
      { fields: ["subCategoryId"] },
    ],
  }
);

// Associations
DirectoryCategoryMapping.belongsTo(DirectoryCategory, {
  foreignKey: "categoryId",
  as: "category",
});
DirectoryCategoryMapping.belongsTo(DirectorySubCategory, {
  foreignKey: "subCategoryId",
  as: "subCategory",
});
DirectoryCategoryMapping.belongsTo(Directory, {
  foreignKey: "directoryId",
  as: "directory",
});

DirectoryCategory.hasMany(DirectoryCategoryMapping, {
  foreignKey: "categoryId",
});
DirectorySubCategory.hasMany(DirectoryCategoryMapping, {
  foreignKey: "subCategoryId",
});
Directory.hasMany(DirectoryCategoryMapping, { foreignKey: "directoryId" });

// Directory.belongsToMany(DirectoryCategory, {
//   through: DirectoryCategoryMapping,
//   foreignKey: "directoryId",
//   otherKey: "categoryId",
//   as: "categories",
// });

// DirectoryCategory.belongsToMany(Directory, {
//   through: DirectoryCategoryMapping,
//   foreignKey: "categoryId",
//   otherKey: "directoryId",
//   as: "directories",
// });

// DirectoryCategoryMapping.belongsTo(Directory, {
//   foreignKey: "directoryId",
//   as: "directory",
// });

// DirectoryCategoryMapping.belongsTo(DirectoryCategory, {
//   foreignKey: "categoryId",
//   as: "category",
// });

// DirectoryCategoryMapping.belongsTo(DirectorySubCategory, {
//   foreignKey: "subCategoryId",
//   as: "subCategory",
// });

export default DirectoryCategoryMapping;
