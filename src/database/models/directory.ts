import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from "sequelize";
import sequelize from "./db";
import User, { REGISTRATION_STATUS } from "./user";
import DirectoryPlan from "./directoryPlan";

class Directory extends Model<
  InferAttributes<Directory>,
  InferCreationAttributes<Directory>
> {
  declare id: CreationOptional<number>;
  declare companyName: string;
  declare logo: string | null;
  declare companyType: string | null;
  declare companyTagline: string | null;

  declare contactPersonName: string | null;
  declare email: string | null;
  declare phoneNumber: string | null;
  declare whatsAppNumber: string | null;
  declare address: string | null;
  declare website: string | null;
  declare city: string | null;
  declare state: string | null;
  declare pinCode: string | null;
  declare location: string | null;

  declare companyShortDescription: string | null;
  declare companyProfile: string | null;
  declare yearEstablished: string | null;
  declare numberOfEmployees: string | null;
  declare annualRevenue: string | null;
  declare keyCapabilities: string | null;
  declare industriesServed: string[] | null;

  declare products: string[] | null;
  declare productDescription: string | null;
  declare applicationAreas: string | null;
  declare tags: string[] | null;

  declare subsidiaries: string | null;
  declare technologyBrands: string | null;
  declare associations: string | null;
  declare strategicPartnerships: string | null;
  declare certifications: string | null;

  declare status: string | null;
  declare isActive: CreationOptional<boolean>;

  declare userId: ForeignKey<User["id"]> | null;
  declare onBoardedBy: ForeignKey<User["id"]> | null;
  declare planId: ForeignKey<DirectoryPlan["id"]> | null;
  declare planStartDate: Date | null;
  declare planEndDate: Date | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Directory.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    companyName: { type: DataTypes.STRING, allowNull: false },
    logo: DataTypes.STRING,
    companyType: DataTypes.STRING,
    companyTagline: DataTypes.STRING,
    contactPersonName: DataTypes.STRING,
    email: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    whatsAppNumber: DataTypes.STRING,
    address: DataTypes.STRING,
    website: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    pinCode: DataTypes.STRING,
    location: DataTypes.STRING,

    companyShortDescription: DataTypes.STRING,
    companyProfile: DataTypes.TEXT,
    yearEstablished: DataTypes.STRING,
    numberOfEmployees: DataTypes.STRING,
    annualRevenue: DataTypes.STRING,

    keyCapabilities: DataTypes.TEXT,
    industriesServed: DataTypes.ARRAY(DataTypes.STRING),
    products: DataTypes.ARRAY(DataTypes.STRING),
    productDescription: DataTypes.TEXT,
    applicationAreas: DataTypes.TEXT,
    tags: DataTypes.ARRAY(DataTypes.STRING),
    subsidiaries: DataTypes.TEXT,
    technologyBrands: DataTypes.TEXT,
    associations: DataTypes.TEXT,
    strategicPartnerships: DataTypes.TEXT,
    certifications: DataTypes.STRING,
    status: {
      type: DataTypes.STRING,
      defaultValue: REGISTRATION_STATUS.PENDING,
    },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
    },
    onBoardedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    planId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "directoryPlans", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    planStartDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    planEndDate: {
      type: DataTypes.DATE,
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
    modelName: "Directory",
    tableName: "directories",
    timestamps: true,
  }
);

Directory.belongsTo(User, { foreignKey: "userId", as: "owner" });
Directory.belongsTo(User, { foreignKey: "onBoardedBy", as: "onboardedByUser" });
Directory.belongsTo(DirectoryPlan, { foreignKey: "planId", as: "plan" });

export default Directory;
