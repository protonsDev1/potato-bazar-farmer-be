"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("mandiAllotedToMandiAgents", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      mandiId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "mandiLists",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      mandiAgentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "mandiAgents",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      isDeleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
        allowNull: false,
      },
    });


    await queryInterface.addIndex("mandiAllotedToMandiAgents", ["mandiId"]);
    await queryInterface.addIndex("mandiAllotedToMandiAgents", ["mandiAgentId"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("mandiAllotedToMandiAgents");
  },
};
