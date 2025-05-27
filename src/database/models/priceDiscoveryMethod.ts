import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from './db';

class PriceDiscoveryMethod extends Model<InferAttributes<PriceDiscoveryMethod>, InferCreationAttributes<PriceDiscoveryMethod>> {
  declare id: CreationOptional<number>;
  declare farmerId: number;
  declare method: string | null;
}

PriceDiscoveryMethod.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    farmerId: {
      type: DataTypes.INTEGER,
      references: { model: 'Farmers', key: 'id' },
      onDelete: 'CASCADE',
      allowNull: false,
    },
    method: { type: DataTypes.STRING, allowNull: true },
  },
  {
    sequelize,
    modelName: 'PriceDiscoveryMethod',
    tableName: 'PriceDiscoveryMethods',
    timestamps: false,
    indexes: [{ fields: ['farmerId'] }],
  }
);

export default PriceDiscoveryMethod;
