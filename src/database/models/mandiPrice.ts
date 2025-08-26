import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import MandiGradePrice from "./mandiGradePrice";

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
  declare mandiName: string;
  declare date: Date;
  declare variety: string;
  declare category: string;
  declare arrivalStatus: string;
  declare state: string;
  declare city: string;
  declare totalArrivalBags: number;
  declare normalMandiArrivalBags: number;
  declare isActive: boolean;
  declare isDeleted: boolean;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare grades?: MandiGradePrice;
}

MandiPrice.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    mandiName: {
      type: DataTypes.STRING,
      allowNull: false,
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
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
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
      { fields: ["state"] },
      { fields: ["city"] },
      { fields: ["mandiName"] },
      { fields: ["variety"] },
      { fields: ["isActive"] },
      { fields: ["isDeleted"] },
    ],
  }
);

export default MandiPrice;
