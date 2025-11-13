import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import KnowledgeHub from "./knowledgeHub";

class KnowledgeHubView extends Model<
  InferAttributes<KnowledgeHubView>,
  InferCreationAttributes<KnowledgeHubView>
> {
  declare id: CreationOptional<number>;
  declare knowledgeHubId: number;
  declare userId: number;
}

KnowledgeHubView.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    knowledgeHubId: {
      type: DataTypes.INTEGER,
      references: { model: "knowledgeHubs", key: "id" },
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
    modelName: "KnowledgeHubView",
    tableName: "knowldgeHubViews",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "knowledgeHubId"],
      },
    ],
  }
);

KnowledgeHub.hasMany(KnowledgeHubView, {
  foreignKey: "knowledgeHubId",
  as: "knowledgeHubViews",
});

KnowledgeHubView.belongsTo(KnowledgeHub, {
  foreignKey: "knowledgeHubId",
  as: "knowledgeHubs",
});

export default KnowledgeHubView;
