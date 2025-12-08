import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import sequelize from "./db";
import Banner from "./banner";

class Event extends Model<
  InferAttributes<Event>,
  InferCreationAttributes<Event>
> {
  declare id: CreationOptional<number>;
  declare email: string;
  declare mobile: string;
  declare organiserName: string;
  declare image: string[];
  declare category: string;
  declare title: string;
  declare description: Text;
  declare startDate: CreationOptional<Date>;
  declare endDate: CreationOptional<Date>;
  declare startTime: string;
  declare endTime: string;
  declare state: string;
  declare district: string;
  declare city: string;
  declare location: string;
  declare document: string[];
  declare website: string;
  declare contactUrl: string;
  declare isFeatured: boolean;
  declare localizedContent: Record<
    string,
    {
      title: string;
      description: string;
      category: string;
      location: string;
      dateText: object;
    }
  > | null;
  declare banner?: Banner;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Event.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    organiserName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    district: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    document: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contactUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    modelName: "Event",
    tableName: "events",
    timestamps: true,
    indexes: [
      {
        fields: ["startDate", "endDate"],
      },
      {
        fields: ["location"],
      },
      {
        fields: ["email"],
      },
      {
        fields: ["mobile"],
      },
    ],
  }
);

export default Event;
