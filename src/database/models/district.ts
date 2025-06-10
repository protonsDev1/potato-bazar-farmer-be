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

class District extends Model<
  InferAttributes<District>,
  InferCreationAttributes<District>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare cityId: ForeignKey<City["id"]>;
  declare city?: NonAttribute<City>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
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
    cityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "cities",
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
    modelName: "District",
    tableName: "districts",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["name", "cityId"],
      },
    ],
  }
);

City.hasMany(District, { foreignKey: "cityId", as: "districts" });
District.belongsTo(City, { foreignKey: "cityId", as: "city" });

export default District;
