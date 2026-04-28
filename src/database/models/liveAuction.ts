import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import User from "./user";

export enum LIVE_AUCTION_STATUS {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

class LiveAuction extends Model<
  InferAttributes<LiveAuction>,
  InferCreationAttributes<LiveAuction>
> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare auctionDate: string | null;
  declare auctionTime: string | null;

  // 🔹 Basic Info
  declare potatoType: string;
  declare potatoVariety: string;
  declare quantity: number;
  declare unit: string;
  declare minReservePrice: number | null;
  declare qualityGrade: string | null;

  // 🔹 Specifications
  declare packagingType: string | null;
  declare delivery: string | null;
  declare size: string | null;
  declare sugarContent: string | null;
  declare skinSet: string | null;
  declare fleshColor: string | null;

  // 🔹 Other Info
  declare soilAdherence: string | null;
  declare firmness: string | null;
  declare sproutingStatus: string | null;
  declare organicCertified: boolean;

  declare harvestDate: Date | null;
  declare deliveryWindow: number | null;
  declare deliveryType: string | null;
  declare qualityResponsibilty: string | null;

  declare state: string | null;
  declare district: string | null;
  declare locationOrCity: string | null;
  declare pinCode: string | null;

  declare paymentTimeLine: number | null;

  // 🔹 Media
  declare fullLotView: string | null;
  declare closeQualityView: string | null;
  declare randomSampleView: string | null;
  declare storageView: string | null;
  declare defectPhotos: string[] | null;
  declare lotOverviewVideos: string[] | null;
  declare attachment: string | null;

  // 🔹 Auction Schedule
  declare scheduleDate: string | null; // DATEONLY
  declare scheduleTime: string | null; // TIME

  // 🔹 Contact
  declare contactPerson: string | null;
  declare contactNumber: string | null;
  declare inspectionAddress: string | null;

  // 🔹 Status
  declare status: LIVE_AUCTION_STATUS;
  declare verifiedAt: Date | null;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

LiveAuction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: "id" },
      onDelete: "CASCADE",
    },

    auctionDate: DataTypes.DATEONLY,
    auctionTime: DataTypes.TIME,

    potatoType: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    potatoVariety: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    quantity: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    unit: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    minReservePrice: DataTypes.FLOAT,
    qualityGrade: DataTypes.STRING,

    packagingType: DataTypes.STRING,
    delivery: DataTypes.STRING,
    size: DataTypes.STRING,
    sugarContent: DataTypes.STRING,
    skinSet: DataTypes.STRING,
    fleshColor: DataTypes.STRING,

    soilAdherence: DataTypes.STRING,
    firmness: DataTypes.STRING,
    sproutingStatus: DataTypes.STRING,

    organicCertified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    harvestDate: DataTypes.DATE,
    deliveryWindow: DataTypes.INTEGER,
    deliveryType: DataTypes.STRING,
    qualityResponsibilty: DataTypes.STRING,

    state: DataTypes.STRING,
    district: DataTypes.STRING,
    locationOrCity: DataTypes.STRING,
    pinCode: DataTypes.STRING,

    paymentTimeLine: DataTypes.FLOAT,

    fullLotView: DataTypes.STRING,
    closeQualityView: DataTypes.STRING,
    randomSampleView: DataTypes.STRING,
    storageView: DataTypes.STRING,

    defectPhotos: DataTypes.ARRAY(DataTypes.STRING),
    lotOverviewVideos: DataTypes.ARRAY(DataTypes.STRING),

    attachment: DataTypes.STRING,

    scheduleDate: DataTypes.DATEONLY,
    scheduleTime: DataTypes.TIME,

    contactPerson: DataTypes.STRING,
    contactNumber: DataTypes.STRING,
    inspectionAddress: DataTypes.TEXT,

    status: {
      type: DataTypes.STRING,
      defaultValue: LIVE_AUCTION_STATUS.PENDING,
    },

    verifiedAt: DataTypes.DATE,

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
    modelName: "LiveAuction",
    tableName: "liveAuctions",
    timestamps: true,
  },
);

// 🔗 Associations
LiveAuction.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(LiveAuction, { foreignKey: "userId", as: "liveAuctions" });

export default LiveAuction;
