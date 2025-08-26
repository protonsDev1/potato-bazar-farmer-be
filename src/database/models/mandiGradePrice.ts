import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import MandiPrice from "./mandiPrice";

export enum MANDI_GRADE_TYPE {
  SUPER = "super",
  GOOD = "good",
  AVERAGE = "average",
}

class MandiGradePrice extends Model<
  InferAttributes<MandiGradePrice>,
  InferCreationAttributes<MandiGradePrice>
> {
  declare id: number;
  declare mandiPriceId: number;
  declare mandiGradeType: string;
  declare gradeArrivalPercentage: number;
  declare gradePricePerKg: number;
  declare quantityInBags: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

MandiGradePrice.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    mandiPriceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: MandiPrice,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    mandiGradeType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gradeArrivalPercentage: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    gradePricePerKg: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    quantityInBags: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    modelName: "MandiGradePrice",
    tableName: "mandiGradePrices",
    timestamps: true,
    indexes: [{ fields: ["mandiPriceId"] }, { fields: ["mandiGradeType"] }],
  }
);

MandiGradePrice.belongsTo(MandiPrice, {
  foreignKey: "mandiPriceId",
  as: "mandiPrices",
});
MandiPrice.hasMany(MandiGradePrice, {
  foreignKey: "mandiPriceId",
  as: "grades",
});

export default MandiGradePrice;
