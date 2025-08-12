"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "state", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("users", "district", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("users", "cityOrVillage", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("users", "pinCode", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("users", "userType", {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
    });

    await queryInterface.addColumn("users", "isUserOnBoardedOnMobile", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("users", "state");
    await queryInterface.removeColumn("users", "district");
    await queryInterface.removeColumn("users", "cityOrVillage");
    await queryInterface.removeColumn("users", "pinCode");
    await queryInterface.removeColumn("users", "userType");
    await queryInterface.removeColumn("users", "isUserOnBoardedOnMobile");
  },
};
