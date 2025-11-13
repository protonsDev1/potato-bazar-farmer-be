"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("knowldgeHubViews", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      knowledgeHubId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "knowledgeHubs", 
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },

      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users", 
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // Unique index for (userId, knowledgeHubId)
    await queryInterface.addIndex("knowldgeHubViews", ["userId", "knowledgeHubId"], {
      unique: true,
      name: "unique_user_knowledgeHub_view",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("knowldgeHubViews", "unique_user_knowledgeHub_view");
    await queryInterface.dropTable("knowldgeHubViews");
  },
};
