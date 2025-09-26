import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import ColdStorageRequirement from "./coldStorageRequirement";

class CSRequirementView extends Model<
  InferAttributes<CSRequirementView>,
  InferCreationAttributes<CSRequirementView>
> {
  declare id: CreationOptional<number>;
  declare requirementId: number;
  declare userId: number;
}

CSRequirementView.init(
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
    modelName: "CSRequirementView",
    tableName: "csReqirementViews",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "requirementId"],
      },
    ],
  }
);

ColdStorageRequirement.hasMany(CSRequirementView, {
  foreignKey: "requirementId",
  as: "views",
});

CSRequirementView.belongsTo(ColdStorageRequirement, {
  foreignKey: "requirementId",
  as: "coldStorageRequirement",
});

export default CSRequirementView;
