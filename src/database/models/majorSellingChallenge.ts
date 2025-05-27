import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from './db';

class MajorSellingChallenge extends Model<InferAttributes<MajorSellingChallenge>, InferCreationAttributes<MajorSellingChallenge>> {
  declare id: CreationOptional<number>;
  declare farmerId: number;
  declare name: string | null;
}

MajorSellingChallenge.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    farmerId: {
      type: DataTypes.INTEGER,
      references: { model: 'Farmers', key: 'id' },
      onDelete: 'CASCADE',
      allowNull: false,
    },
    name: { type: DataTypes.STRING, allowNull: true },
  },
  {
    sequelize,
    modelName: 'MajorSellingChallenge',
    tableName: 'MajorSellingChallenges',
    timestamps: false,
    indexes: [{ fields: ['farmerId'] }],
  }
);

export default MajorSellingChallenge;
