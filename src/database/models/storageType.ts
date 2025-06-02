import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from './db';

class StorageType extends Model<InferAttributes<StorageType>, InferCreationAttributes<StorageType>> {
  declare id: CreationOptional<number>;
  declare coldStorageId: number;
  declare storageType: string;
}

StorageType.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  coldStorageId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'coldStorages', key: 'id' },
    onDelete: 'CASCADE',
  },
  storageType: DataTypes.STRING,
}, {
  sequelize,
  modelName: 'StorageType',
  tableName: 'storageTypes',
  timestamps: false
});

export default StorageType;
