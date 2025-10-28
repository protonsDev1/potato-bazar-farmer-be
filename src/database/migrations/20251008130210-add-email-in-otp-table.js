"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("otps", "email", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn("otps", "mobile", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("otps", "email");
    await queryInterface.changeColumn("otps", "mobile", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
