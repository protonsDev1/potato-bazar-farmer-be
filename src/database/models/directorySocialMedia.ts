import { Model, DataTypes } from "sequelize";
import sequelize from "./db";
import Directory from "./directory";

class DirectorySocialMedia extends Model {}

DirectorySocialMedia.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    directoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: { model: "directories", key: "id" },
      onDelete: "CASCADE",
    },
    linkedInUrl: DataTypes.STRING,
    facebookUrl: DataTypes.STRING,
    twitterUrl: DataTypes.STRING,
    youtubeUrl: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: "DirectorySocialMedia",
    tableName: "directorySocialMedia",
    timestamps: true,
  }
);

// Relations
Directory.hasOne(DirectorySocialMedia, {
  foreignKey: "directoryId",
  as: "socialMedia",
});
DirectorySocialMedia.belongsTo(Directory, {
  foreignKey: "directoryId",
  as: "directory",
});

export default DirectorySocialMedia;
