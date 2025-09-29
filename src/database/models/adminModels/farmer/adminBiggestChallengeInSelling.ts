import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import sequelize from "../../db";

class AdminBiggestChallengeInSelling extends Model<
  InferAttributes<AdminBiggestChallengeInSelling>,
  InferCreationAttributes<AdminBiggestChallengeInSelling>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare isActive: boolean;
  declare position: number;
  declare isDeleted: boolean;
}

AdminBiggestChallengeInSelling.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "AdminBiggestChallengeInSelling",
    tableName: "adminBiggestChallengesInSelling",
    timestamps: true,
  }
);

export default AdminBiggestChallengeInSelling;
