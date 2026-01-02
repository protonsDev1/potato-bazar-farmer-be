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
import City from "./city";
import State from "./state";

class District extends Model<
  InferAttributes<District>,
  InferCreationAttributes<District>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare stateId: ForeignKey<State["id"]>;
  declare state?: NonAttribute<State>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare localizedContent: Record<
    string,
    {
      name: string;
    }
  > | null;
}

District.init(
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
      allowNull: true,
      references: { model: "states", key: "id" },
      onDelete: "CASCADE",
    },
    localizedContent: {
      type: DataTypes.JSON,
      allowNull: true,
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
    modelName: "District",
    tableName: "districts",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["name", "stateId"],
      },
    ],
  }
);

State.hasMany(District, { foreignKey: "stateId", as: "districts" });
District.belongsTo(State, { foreignKey: "stateId", as: "state" });

export default District;
