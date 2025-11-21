import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import sequelize from "./db";
import Directory from "./directory";

class SavedDirectory extends Model<
  InferAttributes<SavedDirectory>,
  InferCreationAttributes<SavedDirectory>
> {
  declare id: number;
  declare userId: number;
  declare directoryId: number;
}

SavedDirectory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    directoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: { model: "directories", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    tableName: "savedDirectories",
    indexes: [
      {
        unique: true,
        fields: ["userId", "directoryId"],
        name: "saved_directories_user_directory_unique",
      },
    ],
  }
);

Directory.hasMany(SavedDirectory, {
  foreignKey: "directoryId",
  as: "savedDirectories",
});
SavedDirectory.belongsTo(Directory, {
  foreignKey: "directoryId",
  as: "directory",
});

export default SavedDirectory;
