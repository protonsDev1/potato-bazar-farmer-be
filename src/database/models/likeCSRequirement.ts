import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import ColdStorageRequirement from "./coldStorageRequirement";

class LikeCSRequirement extends Model<
  InferAttributes<LikeCSRequirement>,
  InferCreationAttributes<LikeCSRequirement>
> {
  declare id: CreationOptional<number>;
  declare requirementId: number;
  declare userId: number;
}

LikeCSRequirement.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    requirementId: {
      type: DataTypes.INTEGER,
      references: { model: "coldStorageRequirements", key: "id" },
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
    modelName: "LikeCSRequirement",
    tableName: "likeCSRequirements",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "requirementId"],
      },
    ],
  }
);

ColdStorageRequirement.hasMany(LikeCSRequirement, {
  foreignKey: "requirementId",
  as: "likes",
});

LikeCSRequirement.belongsTo(ColdStorageRequirement, {
  foreignKey: "requirementId",
  as: "coldStorageRequirement",
});

export default LikeCSRequirement;
