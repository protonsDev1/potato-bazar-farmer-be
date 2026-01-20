"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("commentCommunities", {
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

      comment: {
        type: Sequelize.TEXT,
        allowNull: false,
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

    // Composite unique index (userId + communityId)
    await queryInterface.addIndex("commentCommunities", {
      unique: true,
      fields: ["userId", "communityId"],
      name: "unique_user_community_comment",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("commentCommunities");
  },
};
