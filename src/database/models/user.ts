import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
  } from 'sequelize';
  import bcrypt from 'bcrypt';
  import sequelize from './db'; 
import Agent from './agent';


export enum REGISTRATION_STATUS {
  APPROVED = "approved",
  PENDING = "pending",
  REJECTED = "rejected",
}

export enum USER_ROLES {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  SUB_ADMIN = "sub_admin",
  AGENT = "agent",
  USER = "user",
}

  class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: string;
    declare name: string;
    declare email: string;
    declare password?: string; // virtual
    declare password_hash: string;
    declare role: string;
    declare mobile: string;
    declare registration_types: string[] | null;
    declare otpVerified: boolean;
    declare agentProfile?: Agent
    declare lastLogin: CreationOptional<Date>;
    declare location: string;
    declare state: string;
    declare district: string;
    declare cityOrVillage: string;
    declare pinCode: string;
    declare userType: string[];
    declare isUserOnBoardedOnMobile: boolean;
    declare createdAt: CreationOptional<Date>;
    declare passwordUpdatedAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
  
    async validatePassword(password: string): Promise<boolean> {
      return bcrypt.compare(password, this.password_hash);
    }
  }
  
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      password: {
        type: DataTypes.VIRTUAL,
      },
      password_hash: {
        type: DataTypes.STRING,
      },
      role: {
        type: DataTypes.STRING,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      mobile: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true, 
      },
      registration_types: {
        type: DataTypes.JSON, // Or DataTypes.ARRAY(DataTypes.STRING) for PostgreSQL
        allowNull: true,
      },
      otpVerified:{
        type: DataTypes.BOOLEAN,
        defaultValue :false,
      },
      lastLogin: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      passwordUpdatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      location:{
       type: DataTypes.STRING,
       allowNull:true,
      },
      state:{
        type: DataTypes.STRING,
        allowNull:true,
      },
      district: {
          type: DataTypes.STRING,
        allowNull:true,
      },
      cityOrVillage: {
         type: DataTypes.STRING,
        allowNull:true,
      },
      pinCode: {
             type: DataTypes.STRING,
        allowNull:true,
      },
      userType: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true
      },
      isUserOnBoardedOnMobile: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      }
    },
    {
      sequelize,
      tableName: 'users',
      timestamps: true,
      hooks: {
        beforeCreate: async (user: User) => {
          if (user.password) {
            user.password_hash = await bcrypt.hash(user.password, 10);
            user.passwordUpdatedAt = new Date();
          }
        },
        beforeUpdate: async (user: User) => {
          if (user.changed('password')) {
            user.password_hash = await bcrypt.hash(user.password!, 10);
            user.passwordUpdatedAt = new Date();
          }
        },
      },
    }
  );
  
  export default User;
  