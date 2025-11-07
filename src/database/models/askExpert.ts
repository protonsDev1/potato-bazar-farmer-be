import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import sequelize from "./db";
import User from "./user";

export enum QUERY_STATUS {
  CLOSE = "close",
  OPEN = "open",
}

class AskExpert extends Model<
  InferAttributes<AskExpert>,
  InferCreationAttributes<AskExpert>
> {
  declare id: number;
  declare userId: number;
  declare query: Text;
  declare response: Text;
  declare status: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

AskExpert.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    query: { type: DataTypes.TEXT },
    response: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: QUERY_STATUS.OPEN,
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
    modelName: "AskExpert",
    tableName: "askExperts",
    timestamps: true,
  }
);

// Associations

AskExpert.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

export default AskExpert;
