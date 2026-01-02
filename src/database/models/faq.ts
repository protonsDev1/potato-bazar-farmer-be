import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import sequelize from "./db";
import FaqCategory from "./adminModels/mobile/faqCategory";

class Faq extends Model<InferAttributes<Faq>, InferCreationAttributes<Faq>> {
  declare id: CreationOptional<number>;
  declare categoryId: number;
  declare question: string;
  declare answer: string;
  declare localizedContent: Record<
    string,
    {
      question: string;
      answer: string;
    }
  > | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Faq.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: FaqCategory,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: false,
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
    modelName: "Faq",
    tableName: "faqs",
    timestamps: true,
  }
);

// Associations
FaqCategory.hasMany(Faq, {
  foreignKey: "categoryId",
  as: "faqs",
});

Faq.belongsTo(FaqCategory, {
  foreignKey: "categoryId",
  as: "categories",
});

export default Faq;
