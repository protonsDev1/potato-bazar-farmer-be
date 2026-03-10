import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import sequelize from "./db";
import User from "./user";

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
  declare tags: string[] | null;
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
      primaryKey: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },

    category: {
      type: DataTypes.ENUM("market", "farming", "industry"),
      allowNull: false,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },

    images: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      defaultValue: "pending",
    },

    adminRemark: {
      type: DataTypes.TEXT,
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
    tableName: "community_posts",
    modelName: "CommunityPost",
    timestamps: true,
  },
);

User.hasMany(CommunityPost, {
  foreignKey: "userId",
  as: "userPosts",
});

CommunityPost.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

export default CommunityPost;
