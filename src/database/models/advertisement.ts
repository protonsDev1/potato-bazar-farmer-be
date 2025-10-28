import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import AdvertisementService from "./adminModels/mobile/advertisementService";
import User from "./user";

class Advertisement extends Model<
  InferAttributes<Advertisement>,
  InferCreationAttributes<Advertisement>
> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare serviceId: number;
  declare serviceDuration: string;
  declare description: Text;
  declare status: boolean;
  declare updatedAt?: Date;
  declare createdAt?: Date;
}

Advertisement.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    serviceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "advertisementServices",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    serviceDuration: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Advertisement",
    tableName: "advertisements",
    timestamps: true,
  }
);

// Associations
AdvertisementService.hasMany(Advertisement, {
  foreignKey: "serviceId",
  as: "advertisements",
});

Advertisement.belongsTo(AdvertisementService, {
  foreignKey: "serviceId",
  as: "advertisementServices",
});

User.hasMany(Advertisement, {
  foreignKey: "userId",
  as: "advertisements",
});

Advertisement.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

export default Advertisement;
