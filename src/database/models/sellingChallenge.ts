import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from './db';

class SellingChallenge extends Model<InferAttributes<SellingChallenge>, InferCreationAttributes<SellingChallenge>> {
  declare id: CreationOptional<number>;
  declare farmerId: number;
  declare name: string | null;
}

SellingChallenge.init(
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
    modelName: 'SellingChallenge',
    tableName: 'SellingChallenges',
    timestamps: false,
    indexes: [{ fields: ['farmerId'] }],
  }
);

export default SellingChallenge;
