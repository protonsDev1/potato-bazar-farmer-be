import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import User from "./user";

export enum CONTACT_SUPPORT_STATUS {
  CLOSE = "close",
  OPEN = "open",
}

class ContactSupport extends Model<
  InferAttributes<ContactSupport>,
  InferCreationAttributes<ContactSupport>
> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare fullName: string;
  declare mobileNumber: string;
  declare preferredDate: Date;
  declare preferredTime: string;
  declare status: string;
  declare updatedAt?: Date;
  declare createdAt?: Date;
}

ContactSupport.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true, // optional userId
      references: {
        model: "users",
        key: "id",  
      },
      onDelete: "CASCADE",
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mobileNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    preferredDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    preferredTime: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: CONTACT_SUPPORT_STATUS.OPEN,
    },
  },
  {
    sequelize,
    modelName: "ContactSupport",
    tableName: "contactSupport",
    timestamps: true,
  }
);

// Associations

User.hasMany(ContactSupport, {
  foreignKey: "userId",
  as: "contactSupport",
});

ContactSupport.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

export default ContactSupport;
