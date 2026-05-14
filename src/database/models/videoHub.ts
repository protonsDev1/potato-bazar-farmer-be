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
  declare title: string | null;
  declare videoThumbnail: string;
  declare videoUrl: string;
  declare description: string | null;
  declare language: string;
  declare tags: any | null;
  declare status: "Draft" | "Published";
  declare isFeatured: boolean;
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
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    videoThumbnail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    videoUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    language: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Hindi",
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("Draft", "Published"),
      defaultValue: "Published",
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
