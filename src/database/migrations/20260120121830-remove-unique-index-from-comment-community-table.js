"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    
    await queryInterface.removeIndex(
      "commentCommunities",
      "unique_user_community_comment"
    );
  },

  async down(queryInterface, Sequelize) {
  
    await queryInterface.addIndex("commentCommunities", {
      unique: true,
      fields: ["userId", "communityId"],
      name: "unique_user_community_comment",
    });
  },
};
