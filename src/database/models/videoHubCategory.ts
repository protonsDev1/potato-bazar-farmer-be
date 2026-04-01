import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import sequelize from "./db";

class VideoHubCategory extends Model<
  InferAttributes<VideoHubCategory>,
  InferCreationAttributes<VideoHubCategory>
> {
  declare id: CreationOptional<number>;
  declare categoryName: string;
  declare categoryIcon: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

VideoHubCategory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    categoryName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categoryIcon: {
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
    modelName: "VideoHubCategory",
    tableName: "videoHubCategories",
    timestamps: true,
  }
);

export default VideoHubCategory;
