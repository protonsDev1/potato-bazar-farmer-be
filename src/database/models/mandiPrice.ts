import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  NonAttribute,
} from "sequelize";
import sequelize from "./db";
import MandiGradePrice from "./mandiGradePrice";
import City from "./city";

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
  declare startDate: Date;   
  declare endDate: Date;
  declare variety: string;
  declare category: string;
  declare arrivalStatus: string;
  declare totalArrivalBags: number;
  declare normalMandiArrivalBags: number;
  declare cityId: ForeignKey<City["id"]>;
  declare isActive: boolean;
  declare isDeleted: boolean;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // Associations
  declare city?: NonAttribute<City>;
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
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
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
    cityId: {
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
      { fields: ["cityId"] },
      { fields: ["mandiName"] },
      { fields: ["variety"] },
      { fields: ["isActive"] },
      { fields: ["isDeleted"] },
    ],
  }
);

// Associations
MandiPrice.belongsTo(City, { foreignKey: "cityId", as: "city" });
City.hasMany(MandiPrice, { foreignKey: "cityId", as: "mandiPrices" });

export default MandiPrice;
