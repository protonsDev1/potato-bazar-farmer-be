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

class Job extends Model<InferAttributes<Job>, InferCreationAttributes<Job>> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare category: string;
  declare type: string;
  declare description: string;

  declare educationLevel: string[] | null;
  declare skillsRequired: string[] | null;
  declare experienceRequired: number;

  declare workplace: string[] | null;
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
    experienceRequired: { type: DataTypes.FLOAT, allowNull: false },

    workplace: { type: DataTypes.ARRAY(DataTypes.STRING) },
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
  }
);

Job.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(Job, { foreignKey: "userId", as: "jobs" });

export default Job;
