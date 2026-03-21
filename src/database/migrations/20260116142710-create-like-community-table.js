"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("likeCommunities", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      communityId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "community_posts",
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
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    // Ensure a user can like a community post only once
    await queryInterface.addIndex("likeCommunities", {
      unique: true,
      fields: ["userId", "communityId"],
      name: "unique_user_community_like",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("likeCommunities");
  },
};
