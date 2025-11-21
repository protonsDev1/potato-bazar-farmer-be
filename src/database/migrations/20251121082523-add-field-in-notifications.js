// migration example (sequelize-cli)
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("notifications", "broadcastId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "broadcasts",
        key: "id",
      },
      onDelete: "SET NULL",
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn("notifications", "broadcastId");
  },
};
