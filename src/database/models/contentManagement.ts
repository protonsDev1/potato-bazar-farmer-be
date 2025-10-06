import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";

class ContentManagement extends Model<
  InferAttributes<ContentManagement>,
  InferCreationAttributes<ContentManagement>
> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare description: Text;
  declare updatedAt?: Date;
  declare createdAt?: Date;
}

ContentManagement.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: "ContentManagement",
    tableName: "contentManagement",
    timestamps: true,
  }
);

export default ContentManagement;
