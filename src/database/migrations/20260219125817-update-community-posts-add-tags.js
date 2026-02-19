"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // ✅ Make title nullable instead of removing
    await queryInterface.changeColumn("community_posts", "title", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // ✅ Add tags column
    await queryInterface.addColumn("community_posts", "tags", {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // 🔄 Revert title to NOT NULL
    await queryInterface.changeColumn("community_posts", "title", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    // 🔄 Remove tags column
    await queryInterface.removeColumn("community_posts", "tags");
  },
};
