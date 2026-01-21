import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import TransportRequirement from "./transportRequirement";

class TransportRequirementView extends Model<
  InferAttributes<TransportRequirementView>,
  InferCreationAttributes<TransportRequirementView>
> {
  declare id: CreationOptional<number>;
  declare requirementId: number;
  declare userId: number;
}

TransportRequirementView.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    requirementId: {
      type: DataTypes.INTEGER,
      references: { model: "transportRequirements", key: "id" },
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
    modelName: "TransportRequirementView",
    tableName: "transportRequirementViews",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "requirementId"],
      },
    ],
  },
);

TransportRequirement.hasMany(TransportRequirementView, {
  foreignKey: "requirementId",
  as: "views",
});

TransportRequirementView.belongsTo(TransportRequirement, {
  foreignKey: "requirementId",
  as: "coldStorageRequirement",
});

export default TransportRequirementView;
