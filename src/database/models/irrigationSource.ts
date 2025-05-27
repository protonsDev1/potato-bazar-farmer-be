import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from './db';

class IrrigationSource extends Model<InferAttributes<IrrigationSource>, InferCreationAttributes<IrrigationSource>> {
  declare id: CreationOptional<number>;
  declare farmerId: number;
  declare method: string | null;
}

IrrigationSource.init(
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
    modelName: 'IrrigationSource',
    tableName: 'IrrigationSources',
    timestamps: false,
    indexes: [{ fields: ['farmerId'] }],
  }
);

export default IrrigationSource;
