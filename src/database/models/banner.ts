import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import Event from "./event";

class Banner extends Model<
  InferAttributes<Banner>,
  InferCreationAttributes<Banner>
> {
  declare id: number;
  declare name: string | null;
  declare image: string;
  declare startDate: Date | null;
  declare endDate: Date | null;
  declare redirectionUrl: string | null;
  declare position: number | null;
  declare eventId: number | null;
  declare isActive: boolean;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Banner.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: true },
    image: { type: DataTypes.STRING, allowNull: false },
    startDate: { type: DataTypes.DATEONLY, allowNull: true },
    endDate: { type: DataTypes.DATEONLY, allowNull: true },
    redirectionUrl: { type: DataTypes.STRING, allowNull: true },
    position: { type: DataTypes.INTEGER, allowNull: true },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Event,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
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
    modelName: "Banner",
    tableName: "banners",
    timestamps: true,
  }
);

Event.hasOne(Banner, {
  foreignKey: "eventId",
  as: "banner",
  onDelete: "CASCADE",
});

Banner.belongsTo(Event, {
  foreignKey: "eventId",
  as: "event",
});

export default Banner;
