import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from './db';

class SellingChannel extends Model<InferAttributes<SellingChannel>, InferCreationAttributes<SellingChannel>> {
  declare id: CreationOptional<number>;
  declare farmerId: number;
  declare name: string | null;
}

SellingChannel.init(
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
    modelName: 'SellingChannel',
    tableName: 'SellingChannels',
    timestamps: false,
    indexes: [{ fields: ['farmerId'] }],
  }
);

export default SellingChannel;
