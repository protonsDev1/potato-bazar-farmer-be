import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import Job from "./job";

class LikeJob extends Model<
  InferAttributes<LikeJob>,
  InferCreationAttributes<LikeJob>
> {
  declare id: CreationOptional<number>;
  declare jobId: number;
  declare userId: number;
}

LikeJob.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    jobId: {
      type: DataTypes.INTEGER,
      references: { model: "jobs", key: "id" },
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
    modelName: "LikeJob",
    tableName: "likeJobs",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "jobId"],
      },
    ],
  }
);

Job.hasMany(LikeJob, {
  foreignKey: "jobId",
  as: "likes",
});

LikeJob.belongsTo(Job, {
  foreignKey: "jobId",
  as: "job",
});

export default LikeJob;
