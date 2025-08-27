import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
  } from "sequelize";
  import sequelize from "./db";
  import State from "../models/state";
  
  class City extends Model<InferAttributes<City>, InferCreationAttributes<City>> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare stateId: number; 
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
  }
  
  City.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },
      stateId: { type: DataTypes.INTEGER, allowNull: false },
      createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    },
    {
      sequelize,
      modelName: "City",
      tableName: "cities",
      timestamps: true,
    }
  );
  
  State.hasMany(City, { foreignKey: "stateId" });
  City.belongsTo(State, { foreignKey: "stateId" });
  
  export default City;
  