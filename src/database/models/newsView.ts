import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import News from "./news";

class NewsView extends Model<
  InferAttributes<NewsView>,
  InferCreationAttributes<NewsView>
> {
  declare id: CreationOptional<number>;
  declare newsId: number;
  declare userId: number;
}

NewsView.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    newsId: {
      type: DataTypes.INTEGER,
      references: { model: "news", key: "id" },
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
    modelName: "NewsView",
    tableName: "newsViews",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "newsId"],
      },
    ],
  }
);

News.hasMany(NewsView, {
  foreignKey: "newsId",
  as: "newsViews",
});

NewsView.belongsTo(News, {
  foreignKey: "newsId",
  as: "news",
});

export default NewsView;
