"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("community_posts", {
      fields: ["userId"],
      type: "foreign key",
      name: "fk_community_posts_userId",
      references: {
        table: "users",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "community_posts",
      "fk_community_posts_userId",
    );
  },
};
