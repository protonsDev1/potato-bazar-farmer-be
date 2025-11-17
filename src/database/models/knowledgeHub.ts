import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import State from "./state";
import District from "./district";

export enum KNOWLEDGE_HUB_STATUS {
  DRAFT = "Draft",
  PUBLISHED = "Published",
  ARCHIVED = "Archived",
}

export enum KNOWLEDGE_HUB_CATEGORY {
  FARMING = "Farming(Agronomy)",
  SUPPLY_CHAIN = "Supply Chain(Post Harvest Storage & Logistics)",
  MARKET_TRADE = "Market & Trade",
  PROCESSING = "Processing",
  RESEARCH_INNOVATION = "Research & Innovation",
}

class KnowledgeHub extends Model<
  InferAttributes<KnowledgeHub>,
  InferCreationAttributes<KnowledgeHub>
> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare category: string;
  declare status: string;
  declare description: string;
  declare images: string[] | null;
  declare tags: string[];
  declare views: CreationOptional<number>;
  declare isFeatured: boolean;
  declare createdBy: string | null;
  declare source: string | null;
  declare ytVideos: string[] | null;
  declare isPanIndia: boolean;
  declare stateId: number;
  declare districtId: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

KnowledgeHub.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    source: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ytVideos: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: true,
    },
    isPanIndia: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    stateId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: State,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    districtId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: District,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "KnowledgeHub",
    tableName: "knowledgeHubs",
    timestamps: true,
  }
);

// Associations
KnowledgeHub.belongsTo(State, {
  foreignKey: "stateId",
  as: "state",
});

State.hasMany(KnowledgeHub, { foreignKey: "stateId", as: "knowledgeHubs" });

KnowledgeHub.belongsTo(District, {
  foreignKey: "districtId",
  as: "district",
});

District.hasMany(KnowledgeHub, {
  foreignKey: "districtId",
  as: "knowledgeHubs",
});

export default KnowledgeHub;
