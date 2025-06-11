import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  NonAttribute,
} from "sequelize";
import sequelize from "./db";

import State from "./state";

class City extends Model<InferAttributes<City>, InferCreationAttributes<City>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare stateId: ForeignKey<State["id"]>;
  declare state?: NonAttribute<State>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

City.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "states",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "City",
    tableName: "cities",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["name", "stateId"],
      },
    ],
  }
);

State.hasMany(City, { foreignKey: "stateId", as: "cities" });
City.belongsTo(State, { foreignKey: "stateId", as: "state" });

export default City;
