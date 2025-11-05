import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import City from "./city";
import MandiPrice from "./mandiPrice";

class MandiList extends Model<
  InferAttributes<MandiList>,
  InferCreationAttributes<MandiList>
> {
  declare id: number;
  declare cityId: number;
  declare mandiName: string;
  declare address: string | null;
  declare isActive: boolean;
  declare isDeleted: boolean;
  declare isTopMandi: boolean;
  declare position: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare city?: City;
  declare mandiPrices?: MandiPrice[];
}

MandiList.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    cityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: City,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    mandiName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isTopMandi: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
    modelName: "MandiList",
    tableName: "mandiLists",
    timestamps: true,
    indexes: [{ fields: ["cityId"] }],
  }
);

// Associations
MandiList.belongsTo(City, {
  foreignKey: "cityId",
  as: "city",
});

City.hasMany(MandiList, { foreignKey: "cityId", as: "mandis" });

export default MandiList;
