import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import CommunityPost from "./communityPost";

class LikeCommunity extends Model<
  InferAttributes<LikeCommunity>,
  InferCreationAttributes<LikeCommunity>
> {
  declare id: CreationOptional<number>;
  declare communityId: number;
  declare userId: number;
}

LikeCommunity.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    communityId: {
      type: DataTypes.INTEGER,
      references: { model: "community_posts", key: "id" },
      onDelete: "CASCADE",
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
    modelName: "LikeCommunity",
    tableName: "likeCommunities",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "communityId"],
      },
    ],
  }
);

CommunityPost.hasMany(LikeCommunity, {
  foreignKey: "communityId",
  as: "likes",
});

LikeCommunity.belongsTo(CommunityPost, {
  foreignKey: "communityId",
  as: "community",
});

export default LikeCommunity;
