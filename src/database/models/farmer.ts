import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import PotatoVarietyGrown from "./potatoVarietyGrown";
import User from "./user";
import IrrigationSource from "./irrigationSource";
import FarmEquipment from "./farmEquipment";
import PriceDiscoveryMethod from "./priceDiscoveryMethod";
import SellingChallenge from "./sellingChallenge";
import MajorSellingChallenge from "./majorSellingChallenge";
import SellingChannel from "./sellingChannel";
import TechnologyUsed from "./technologyUsed";
import PotatoType from "./potatoType";

class Farmer extends Model<
  InferAttributes<Farmer>,
  InferCreationAttributes<Farmer>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare age: number;
  declare gender: string;
  declare optionalNumber: string | null;
  declare whatsappNumber: string | null;
  declare caste: string | null;
  declare subCaste: string | null;
  declare village: string | null;
  declare taluka: string | null;
  declare district: string | null;
  declare state: string | null;
  declare geoLocation: string | null;
  declare isAadhaarCard: boolean | null;
  declare aadhaarNumber: string | null;
  declare pinCode: string | null;
  declare digiPin: string | null;
  declare isBankAccount: boolean | null;
  declare onBoardedBy: number | null;
  declare userId: number | null;
  declare isDeleted: boolean;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Farmer.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    age: { type: DataTypes.INTEGER, allowNull: false },
    gender: { type: DataTypes.STRING, allowNull: false },
    optionalNumber: { type: DataTypes.STRING, allowNull: true },
    whatsappNumber: { type: DataTypes.STRING, allowNull: true },
    caste: { type: DataTypes.STRING, allowNull: true },
    subCaste: { type: DataTypes.STRING, allowNull: true },
    village: { type: DataTypes.STRING, allowNull: true },
    taluka: { type: DataTypes.STRING, allowNull: true },
    district: { type: DataTypes.STRING, allowNull: true },
    state: { type: DataTypes.STRING, allowNull: true },
    geoLocation: { type: DataTypes.STRING, allowNull: true },
    isAadhaarCard: { type: DataTypes.BOOLEAN, allowNull: true },
    aadhaarNumber: { type: DataTypes.STRING, allowNull: true },
    pinCode: { type: DataTypes.STRING, allowNull: true },
    digiPin: { type: DataTypes.STRING, allowNull: true },
    isBankAccount: { type: DataTypes.BOOLEAN, allowNull: true },
    onBoardedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    modelName: "Farmer",
    tableName: "Farmers",
    timestamps: true,
  }
);

Farmer.hasMany(PotatoVarietyGrown, {
  foreignKey: "farmerId",
  as: "PotatoVarietyGrown",
});

PotatoVarietyGrown.belongsTo(Farmer, {
  foreignKey: "farmerId",
});

Farmer.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Farmer.belongsTo(User, {
  foreignKey: "onBoardedBy",
  as: "onBoardedByUser",
});

Farmer.hasMany(IrrigationSource, {
  foreignKey: "farmerId",
});

IrrigationSource.belongsTo(Farmer, {
  foreignKey: "farmerId",
});

Farmer.hasMany(FarmEquipment, {
  foreignKey: "farmerId",
});

FarmEquipment.belongsTo(Farmer, {
  foreignKey: "farmerId",
});

Farmer.hasMany(PriceDiscoveryMethod, {
  foreignKey: "farmerId",
});

PriceDiscoveryMethod.belongsTo(Farmer, {
  foreignKey: "farmerId",
});

Farmer.hasMany(SellingChallenge, {
  foreignKey: "farmerId",
});

SellingChallenge.belongsTo(Farmer, {
  foreignKey: "farmerId",
});

Farmer.hasMany(MajorSellingChallenge, {
  foreignKey: "farmerId",
});

MajorSellingChallenge.belongsTo(Farmer, {
  foreignKey: "farmerId",
});

Farmer.hasMany(SellingChannel, {
  foreignKey: "farmerId",
});

SellingChannel.belongsTo(Farmer, {
  foreignKey: "farmerId",
});

Farmer.hasMany(MajorSellingChallenge, {
  foreignKey: "farmerId",
});

MajorSellingChallenge.belongsTo(Farmer, {
  foreignKey: "farmerId",
});

Farmer.hasMany(TechnologyUsed, {
  foreignKey: "farmerId",
});

TechnologyUsed.belongsTo(Farmer, {
  foreignKey: "farmerId",
});

Farmer.hasMany(PotatoType, {
  foreignKey: "farmerId",
});

PotatoType.belongsTo(Farmer, {
  foreignKey: "farmerId",
});
export default Farmer;
