import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import CommunityPost from "./communityPost";
import User from "./user";

class CommentCommunity extends Model<
  InferAttributes<CommentCommunity>,
  InferCreationAttributes<CommentCommunity>
> {
  declare id: CreationOptional<number>;
  declare communityId: number;
  declare comment: string;
  declare userId: number;
}

CommentCommunity.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    communityId: {
      type: DataTypes.INTEGER,
      references: { model: "community_posts", key: "id" },
      onDelete: "CASCADE",
      allowNull: false,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "CommentCommunity",
    tableName: "commentCommunities",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "communityId"],
      },
    ],
  }
);

CommunityPost.hasMany(CommentCommunity, {
  foreignKey: "communityId",
  as: "comments",
});

CommentCommunity.belongsTo(CommunityPost, {
  foreignKey: "communityId",
  as: "communityComments",
});


User.hasMany(CommentCommunity, {
  foreignKey: "userId",
  as: "userComments",
});

CommentCommunity.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});



export default CommentCommunity;
