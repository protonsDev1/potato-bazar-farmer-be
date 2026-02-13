import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import TransportService from "./transportService";

class TransportServiceView extends Model<
  InferAttributes<TransportServiceView>,
  InferCreationAttributes<TransportServiceView>
> {
  declare id: CreationOptional<number>;
  declare serviceId: number;
  declare userId: number;
}

TransportServiceView.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    serviceId: {
      type: DataTypes.INTEGER,
      references: { model: "transportServices", key: "id" },
      onDelete: "CASCADE",
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "TransportServiceView",
    tableName: "transportServiceViews",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "serviceId"],
      },
    ],
  },
);

TransportService.hasMany(TransportServiceView, {
  foreignKey: "serviceId",
  as: "views",
});

TransportServiceView.belongsTo(TransportService, {
  foreignKey: "serviceId",
  as: "transportService",
});

export default TransportServiceView;
