import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import User from "./user";

class CropDiagnosis extends Model<
  InferAttributes<CropDiagnosis>,
  InferCreationAttributes<CropDiagnosis>
> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare disease: string | null;
  declare confidence: number | null;
  declare image: string;
  declare diagnosis: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

CropDiagnosis.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    disease: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    confidence: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: null,
    },
    diagnosis: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "CropDiagnosis",
    tableName: "cropDiagnoses",
    timestamps: true,
  }
);

// Associations

CropDiagnosis.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

export default CropDiagnosis;
