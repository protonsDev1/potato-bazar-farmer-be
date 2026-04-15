import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import sequelize from "./db";
import VideoHubCategory from "./videoHubCategory";

class VideoHub extends Model<
  InferAttributes<VideoHub>,
  InferCreationAttributes<VideoHub>
> {
  declare id: CreationOptional<number>;
  declare categoryId: number;
  declare videoThumbnail: string;
  declare videoUrl: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

VideoHub.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: VideoHubCategory,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    videoThumbnail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    videoUrl: {
      type: DataTypes.STRING,
      allowNull: false,
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
    modelName: "VideoHub",
    tableName: "videoHubs",
    timestamps: true,
  }
);

// Associations
VideoHubCategory.hasMany(VideoHub, {
  foreignKey: "categoryId",
  as: "videos",
});

VideoHub.belongsTo(VideoHubCategory, {
  foreignKey: "categoryId",
  as: "category",
});

export default VideoHub;
