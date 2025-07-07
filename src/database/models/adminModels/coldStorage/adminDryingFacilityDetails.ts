import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import sequelize from "../../db";

class AdminDryingFacilityDetail extends Model<
  InferAttributes<AdminDryingFacilityDetail>,
  InferCreationAttributes<AdminDryingFacilityDetail>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare isActive: boolean;
  declare position: number;
}

AdminDryingFacilityDetail.init(
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
  },
  {
    sequelize,
    modelName: "AdminDryingFacilityDetail",
    tableName: "adminDryingFacilityDetails",
    timestamps: true,
  }
);

export default AdminDryingFacilityDetail;
