import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import User from "./user";
import ColdStorage from "./coldStorage";

export enum REQUEST_STATUS {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}

class InterestRequest extends Model<
  InferAttributes<InterestRequest>,
  InferCreationAttributes<InterestRequest>
> {
  declare id: CreationOptional<number>;
  declare senderUserId: number;
  declare coldStorageId: number;
  declare requirementId: number;
  declare status: "pending" | "accepted" | "rejected";
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

InterestRequest.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    senderUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    coldStorageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "coldStorages",
        key: "id",
      },
    },
    requirementId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "coldStorageRequirements",
        key: "id",
      },
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: REQUEST_STATUS.PENDING,
    },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    modelName: "InterestRequest",
    tableName: "interestRequests",
    timestamps: true,
  }
);

// Associations
InterestRequest.belongsTo(User, { foreignKey: "senderUserId", as: "sender" });
InterestRequest.belongsTo(ColdStorage, {
  foreignKey: "coldStorageId",
  as: "coldStorage",
});

export default InterestRequest;
