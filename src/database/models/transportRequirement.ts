import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import sequelize from "./db";
import User from "./user";

export enum TRANSPORT_SERVICE_STATUS {
  APPROVED = "approved",
  PENDING = "pending",
  REJECTED = "rejected",
}

class TransportRequirement extends Model<
  InferAttributes<TransportRequirement>,
  InferCreationAttributes<TransportRequirement>
> {
  declare id: CreationOptional<number>;
  declare requirementUid: string;
  declare pickLocationOrCity: string | null;
  declare pickDistrict: string | null;
  declare pickState: string | null;
  declare dropLocationOrCity: string | null;
  declare dropDistrict: string | null;
  declare dropState: string | null;
  declare quantityUnit: string | null;
  declare quantity: number | null;
  declare packaging: string | null;
  declare vehicleTypeRequired: string[];
  declare preferredPickUpDate: string | null;
  declare rateExpectation: string | null;
  declare additionalRequired: string[];
  declare ownerOrCompanyName: string | null;
  declare phoneNumber: string | null;
  declare whatsappNumber: string | null;
  declare alternatePhoneNumber: string | null;
  declare isActive: boolean;
  declare createdBy: number;
  declare status: string;
  declare reason: string | null;
}

TransportRequirement.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    requirementUid: { type: DataTypes.STRING, allowNull: true, unique: true },
    pickLocationOrCity: {
      type: DataTypes.STRING,
    },
    pickDistrict: {
      type: DataTypes.STRING,
    },
    pickState: {
      type: DataTypes.STRING,
    },
    dropLocationOrCity: {
      type: DataTypes.STRING,
    },
    dropDistrict: {
      type: DataTypes.STRING,
    },
    dropState: {
      type: DataTypes.STRING,
    },
    quantityUnit: {
      type: DataTypes.STRING,
    },
    quantity: {
      type: DataTypes.NUMBER,
    },
    packaging: {
      type: DataTypes.STRING,
    },
    vehicleTypeRequired: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    preferredPickUpDate: {
      type: DataTypes.DATEONLY,
    },
    rateExpectation: {
      type: DataTypes.STRING,
    },
    additionalRequired: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    ownerOrCompanyName: {
      type: DataTypes.STRING,
    },
    phoneNumber: {
      type: DataTypes.STRING,
    },
    whatsappNumber: {
      type: DataTypes.STRING,
    },
    alternatePhoneNumber: {
      type: DataTypes.STRING,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: TRANSPORT_SERVICE_STATUS.PENDING,
    },
  },
  {
    sequelize,
    modelName: "TransportRequirement",
    tableName: "transportRequirements",
    timestamps: true,
  },
);

// Associations
TransportRequirement.belongsTo(User, {
  foreignKey: "createdBy",
  as: "creator",
});

export default TransportRequirement;
