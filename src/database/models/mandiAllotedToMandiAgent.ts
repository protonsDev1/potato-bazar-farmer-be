import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import MandiList from "./mandiList";
import MandiAgent from "./mandiAgent";

class MandiAllotedToMandiAgent extends Model<
  InferAttributes<MandiAllotedToMandiAgent>,
  InferCreationAttributes<MandiAllotedToMandiAgent>
> {
  declare id: number;
  declare mandiId: number;
  declare mandiAgentId: number;
  declare isActive: boolean;
  declare isDeleted: boolean;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

MandiAllotedToMandiAgent.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    mandiId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: MandiList,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    mandiAgentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: MandiAgent,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "MandiAllotedToMandiAgent",
    tableName: "mandiAllotedToMandiAgents",
    timestamps: true,
    indexes: [{ fields: ["mandiId"] }, { fields: ["mandiAgentId"] }],
  }
);

// Associations
MandiAllotedToMandiAgent.belongsTo(MandiAgent, {
  foreignKey: "mandiAgentId",
  as: "allotedAgentToMandis",
});
MandiAgent.hasMany(MandiAllotedToMandiAgent, {
  foreignKey: "mandiAgentId",
  as: "allotedMandisToAgent",
});
MandiAllotedToMandiAgent.belongsTo(MandiList, {
  foreignKey: "mandiId",
  as: "mandiName",
});


export default MandiAllotedToMandiAgent;
