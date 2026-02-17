import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import sequelize from "./db";
import { TRANSPORT_SERVICE_STATUS } from "./transportRequirement";
import User from "./user";

class TransportService extends Model<
  InferAttributes<TransportService>,
  InferCreationAttributes<TransportService>
> {
  declare id: CreationOptional<number>;
  declare transporterType: string;
  declare vehicleTypeRequired: string[];
  declare noOfVehicles: number;
  declare routeCoverage: string[];
  declare rateType: string;
  declare additionalRequired: string[];
  declare documents: string[];
  declare ownerOrCompanyName: string | null;
  declare phoneNumber: string | null;
  declare whatsappNumber: string | null;
  declare alternatePhoneNumber: string | null;
  declare isActive: boolean;
  declare createdBy: number;
  declare pbVerified: boolean;
  declare isAvailable: boolean;
  declare status: string;
  declare reason: string | null;
}

TransportService.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    transporterType: {
      type: DataTypes.STRING,
    },
    vehicleTypeRequired: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    noOfVehicles: {
      type: DataTypes.NUMBER,
    },
    routeCoverage: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    rateType: {
      type: DataTypes.STRING,
    },
    additionalRequired: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    documents: {
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
    pbVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    modelName: "TransportService",
    tableName: "transportServices",
    timestamps: true,
  },
);

TransportService.belongsTo(User, {
  foreignKey: "createdBy",
  as: "creator",
});

export default TransportService;
