import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import sequelize from "./db";
import User from "./user";
import CommunityPost from "./communityPost";

const enum REPORT_STATUS {
  PENDING = "pending",
  RESOLVED = "resolved",
}

class ReportOnCommunityPost extends Model<
  InferAttributes<ReportOnCommunityPost>,
  InferCreationAttributes<ReportOnCommunityPost>
> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare postId: number;
  declare reason: string;
  declare status: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

ReportOnCommunityPost.init(
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
      onUpdate: "CASCADE",
    },

    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "community_posts",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    status: {
      type: DataTypes.STRING,
      defaultValue: "pending",
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
    tableName: "reportOnCommunityPosts",
    modelName: "ReportOnCommunityPost",
    timestamps: true,
  },
);

User.hasMany(ReportOnCommunityPost, {
  foreignKey: "userId",
  as: "userReports",
});

ReportOnCommunityPost.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

ReportOnCommunityPost.belongsTo(CommunityPost, {
  foreignKey: "postId",
  as: "post",
});

export default ReportOnCommunityPost;
