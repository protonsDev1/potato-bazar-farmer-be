import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from './db';

class FarmEquipment extends Model<InferAttributes<FarmEquipment>, InferCreationAttributes<FarmEquipment>> {
  declare id: CreationOptional<number>;
  declare farmerId: number;
  declare machine: string | null;
  declare brand: string | null;
  declare model: string | null;
}

FarmEquipment.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    farmerId: {
      type: DataTypes.INTEGER,
      references: { model: 'Farmers', key: 'id' },
      onDelete: 'CASCADE',
      allowNull: false,
    },
    machine: { type: DataTypes.STRING, allowNull: true },
    brand: { type: DataTypes.STRING, allowNull: true },
    model: { type: DataTypes.STRING, allowNull: true },
  },
  {
    sequelize,
    modelName: 'FarmEquipment',
    tableName: 'FarmEquipment',
    timestamps: false,
    indexes: [{ fields: ['farmerId'] }],
  }
);

export default FarmEquipment;
