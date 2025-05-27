import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
  } from 'sequelize';
  import bcrypt from 'bcrypt';
  import sequelize from './db'; 
  
  class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: string;
    declare name: string;
    declare email: string;
    declare password?: string; // virtual
    declare password_hash: string;
    declare role: string;
    declare mobile: string;
    declare registration_types: string[] | null;
    declare createdAt: CreationOptional<Date>;
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
      
      
    },
    {
      sequelize,
      tableName: 'users',
      timestamps: true,
      hooks: {
        beforeCreate: async (user: User) => {
          if (user.password) {
            user.password_hash = await bcrypt.hash(user.password, 10);
          }
        },
        beforeUpdate: async (user: User) => {
          if (user.changed('password')) {
            user.password_hash = await bcrypt.hash(user.password!, 10);
          }
        },
      },
    }
  );
  
  export default User;
  