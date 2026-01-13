import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from "sequelize";

import sequelize from "./db";

class CommunityPost extends Model<
  InferAttributes<CommunityPost>,
  InferCreationAttributes<CommunityPost>
> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare category: "market" | "farming" | "industry";
  declare title: string;
  declare description: string;
  declare images: string[] | null;
  declare status: "pending" | "approved" | "rejected";
  declare adminRemark: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

CommunityPost.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    category: {
      type: DataTypes.ENUM("market", "farming", "industry"),
      allowNull: false
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    images: {
      type: DataTypes.JSON,
      allowNull: true
    },

    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      defaultValue: "pending"
    },

    adminRemark: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },

    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: "community_posts",
    modelName: "CommunityPost",
    timestamps: true
  }
);

export default CommunityPost;
