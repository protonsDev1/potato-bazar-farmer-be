import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from './db';

class TechnologyUsed extends Model<InferAttributes<TechnologyUsed>, InferCreationAttributes<TechnologyUsed>> {
  declare id: CreationOptional<number>;
  declare farmerId: number;
  declare name: string | null;
}

TechnologyUsed.init(
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
    modelName: 'TechnologyUsed',
    tableName: 'TechnologyUsed',
    timestamps: false,
    indexes: [{ fields: ['farmerId'] }],
  }
);

export default TechnologyUsed;
