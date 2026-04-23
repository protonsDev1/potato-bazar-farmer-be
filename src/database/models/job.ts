import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import User from "./user";

export enum JOB_STATUS {
  APPROVED = "approved",
  PENDING = "pending",
  REJECTED = "rejected",
}

export const EXPERIENCE_RANGE = {
  ZERO_TO_ONE: "0-1 year",
  ONE_TO_THREE: "1-3 years",
  THREE_TO_FIVE: "3-5 years",
  FIVE_PLUS: "5+ years",
};

class Job extends Model<InferAttributes<Job>, InferCreationAttributes<Job>> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare category: string;
  declare type: string;
  declare description: string;

  declare educationLevel: string[] | null;
  declare skillsRequired: string[] | null;
  declare experienceRequired: string;

  declare jobLocations:
    | { stateId: number; districtIds: number[] }[]
    | null;
  declare vacancies: number | null;
  declare salaryMin: number | null;
  declare salaryMax: number | null;

  declare additionalBenefit: string[] | null;
  declare joiningTimeline: string | null;

  declare state: string | null;
  declare district: string | null;
  declare city: string | null;
  declare pincode: string | null;

  declare companyName: string | null;
  declare email: string | null;
  declare mobile: string | null;
  declare whatsAppContact: boolean;
  declare alternateMobile: string | null;

  declare document: string[] | null; // corrected from documect

  declare isActive: boolean;
  declare status: JOB_STATUS;
  declare reason: string | null;

  declare userId: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Job.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    title: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },

    educationLevel: { type: DataTypes.ARRAY(DataTypes.STRING) },
    skillsRequired: { type: DataTypes.ARRAY(DataTypes.STRING) },
    experienceRequired: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    jobLocations: { type: DataTypes.JSONB, allowNull: true, defaultValue: null },
    vacancies: { type: DataTypes.INTEGER },
    salaryMin: { type: DataTypes.INTEGER },
    salaryMax: { type: DataTypes.INTEGER },

    additionalBenefit: { type: DataTypes.ARRAY(DataTypes.STRING) },
    joiningTimeline: { type: DataTypes.STRING },

    state: { type: DataTypes.STRING },
    district: { type: DataTypes.STRING },
    city: { type: DataTypes.STRING },
    pincode: { type: DataTypes.STRING },

    companyName: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    mobile: { type: DataTypes.STRING },
    whatsAppContact: { type: DataTypes.BOOLEAN, defaultValue: false },
    alternateMobile: { type: DataTypes.STRING },

    document: { type: DataTypes.ARRAY(DataTypes.STRING) }, // corrected

    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    status: {
      type: DataTypes.STRING,
      defaultValue: JOB_STATUS.PENDING,
    },
    reason: { type: DataTypes.TEXT },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
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
    modelName: "Job",
    tableName: "jobs",
    timestamps: true,
  },
);

Job.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(Job, { foreignKey: "userId", as: "jobs" });

export default Job;
