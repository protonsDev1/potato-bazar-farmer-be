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

export enum NEWS_STATUS {
  DRAFT = "Draft",
  PUBLISHED = "Published",
  ARCHIVED = "Archived",
}

export enum NEWS_CATEGORY {
  AGRICULTURE = "Agriculture",
  MARKET = "Market",
  TECHNOLOGY = "Technology",
  GOVERNMENT = "Government",
  WEATHER = "Weather",
  EXPORT = "Export",
  RESEARCH = "Research",
  EVENT = "Event",
}

class News extends Model<InferAttributes<News>, InferCreationAttributes<News>> {
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
  declare stateId: number;
  declare districtId: number;

  // New optional fields
  declare introduction: string | null;
  declare keyNumbers: object | null;
  declare changesThisWeek: string | null;
  declare supplyAnalysis: string | null;
  declare demandSignals: string | null;
  declare regionalSnapshot: string | null;
  declare policyRisks: string | null;
  declare faqs: object[] | null;
  declare references: string[] | null;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

News.init(
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
      allowNull: false,
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

    // ✅ Newly added optional fields
    introduction: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    keyNumbers: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    changesThisWeek: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    supplyAnalysis: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    demandSignals: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    regionalSnapshot: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    policyRisks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    faqs: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    references: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
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
    modelName: "News",
    tableName: "news",
    timestamps: true,
  }
);

export default News;
