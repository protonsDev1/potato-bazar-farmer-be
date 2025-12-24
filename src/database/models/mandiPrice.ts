import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import MandiGradePrice from "./mandiGradePrice";
import MandiList from "./mandiList";
import User from "./user";

export enum ARRIVAL_STATUS {
  HIGH = "high",
  NORMAL = "normal",
  LOW = "low",
}

class MandiPrice extends Model<
  InferAttributes<MandiPrice>,
  InferCreationAttributes<MandiPrice>
> {
  declare id: number;
  declare mandiId: number;
  declare date: Date;
  declare variety: string;
  declare category: string;
  declare arrivalStatus: string;
  declare totalArrivalBags: number;
  declare normalMandiArrivalBags: number;
  declare isActive: boolean;
  declare isDeleted: boolean;
  declare createdByMandiAgentUserId: number;
  declare lastUpdatedByMandiAgentUserId: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare localizedContent: Record<
    string,
    {
      variety: string;
      category: string;
      dateText: object;
    }
  > | null;

  // Associations
  declare grades?: MandiGradePrice[];
  declare mandi?: MandiList;
}

MandiPrice.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    mandiId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: MandiList,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    variety: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    arrivalStatus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    totalArrivalBags: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    normalMandiArrivalBags: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdByMandiAgentUserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    lastUpdatedByMandiAgentUserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    localizedContent: {
      type: DataTypes.JSON,
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
    modelName: "MandiPrice",
    tableName: "mandiPrices",
    timestamps: true,
    indexes: [
      { fields: ["mandiId"] },
      { fields: ["variety"] },
      { fields: ["isActive"] },
      { fields: ["isDeleted"] },
      { fields: ["createdByMandiAgentUserId"] },
      { fields: ["lastUpdatedByMandiAgentUserId"] },
    ],
  }
);

MandiPrice.belongsTo(MandiList, {
  foreignKey: "mandiId",
  as: "mandi",
});
MandiList.hasMany(MandiPrice, {
  foreignKey: "mandiId",
  as: "mandiPrices",
});

export default MandiPrice;
