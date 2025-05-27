import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from './db';

class PotatoVarietyGrown extends Model<InferAttributes<PotatoVarietyGrown>, InferCreationAttributes<PotatoVarietyGrown>> {
  declare id: CreationOptional<number>;
  declare farmerId: number;
  declare variety: string | null;
  declare subVariety: string | null;
}

PotatoVarietyGrown.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    farmerId: {
      type: DataTypes.INTEGER,
      references: { model: 'Farmers', key: 'id' },
      onDelete: 'CASCADE',
      allowNull: false,
    },
    variety: { type: DataTypes.STRING, allowNull: true },
    subVariety: { type: DataTypes.STRING, allowNull: true },
  },
  {
    sequelize,
    modelName: 'PotatoVarietyGrown',
    tableName: 'PotatoVarietyGrown',
    timestamps: false,
    indexes: [{ fields: ['farmerId'] }],
  }
);

export default PotatoVarietyGrown;
