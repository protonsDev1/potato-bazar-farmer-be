import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional
  } from 'sequelize';
  import sequelize from './db';
  import User from './user';
  
  class KycDocument extends Model<InferAttributes<KycDocument>, InferCreationAttributes<KycDocument>> {
    declare id: CreationOptional<number>;
    declare userId: number;
    declare panFront: string | null;
    declare aadhaarFront: string;
    declare aadhaarBack: string;
    declare isVerified: boolean;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare status: String;
  }
  
  KycDocument.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      panFront: {
        type: DataTypes.STRING,
        allowNull: true 
      },
      aadhaarFront: {
        type: DataTypes.STRING,
        allowNull: false
      },
      aadhaarBack: {
        type: DataTypes.STRING,
        allowNull: false 
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'pending'
      }
      
    },
    {
      sequelize,
      tableName: 'kyc_documents',
      timestamps: true
    }
  );
  
  // Association
  User.hasOne(KycDocument, {
    foreignKey: 'userId',
    as: 'kycDocument'
  });
  KycDocument.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
  });
  
  export default KycDocument;
  