import { Model, DataTypes, DATE } from "sequelize";
import sequelize from "./db";
import Directory from "./directory";

class DirectoryMedia extends Model {}

DirectoryMedia.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    directoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: { model: "directories", key: "id" },
      onDelete: "CASCADE",
    },
    images: DataTypes.ARRAY(DataTypes.STRING),
    videos: DataTypes.ARRAY(DataTypes.STRING),
    brochures: DataTypes.ARRAY(DataTypes.STRING),
    news: DataTypes.TEXT,
    events: DataTypes.TEXT,
  },
  {
    sequelize,
    modelName: "DirectoryMedia",
    tableName: "directoryMedia",
    timestamps: true,
  }
);

// Associations
Directory.hasOne(DirectoryMedia, {
  foreignKey: "directoryId",
  as: "media",
});
DirectoryMedia.belongsTo(Directory, {
  foreignKey: "directoryId",
  as: "directory",
});

export default DirectoryMedia;
