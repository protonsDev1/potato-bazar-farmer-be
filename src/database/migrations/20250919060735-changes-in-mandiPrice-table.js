"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("mandiPrices", "mandiId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "mandiLists",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addColumn("mandiPrices", "createdByMandiAgentUserId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addColumn("mandiPrices", "lastUpdatedByMandiAgentUserId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });



    await queryInterface.removeColumn("mandiPrices", "mandiName");
    await queryInterface.removeColumn("mandiPrices", "cityId");

    await queryInterface.removeIndex("mandiPrices", ["cityId"]);
    await queryInterface.addIndex("mandiPrices", ["mandiId"]);
    await queryInterface.addIndex("mandiPrices", ["createdByMandiAgentUserId"]);
    await queryInterface.addIndex("mandiPrices", ["lastUpdatedByMandiAgentUserId"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("mandiPrices", ["mandiId"]);
    await queryInterface.removeColumn("mandiPrices", "mandiId");

    await queryInterface.removeIndex("mandiPrices", ["createdByMandiAgentUserId"]);
    await queryInterface.removeColumn("mandiPrices", "createdByMandiAgentUserId");

    await queryInterface.removeIndex("mandiPrices", ["lastUpdatedByMandiAgentUserId"]);
    await queryInterface.removeColumn("mandiPrices", "lastUpdatedByMandiAgentUserId");

    await queryInterface.addColumn("mandiPrices", "mandiName", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn("mandiPrices", "cityId", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    await queryInterface.addIndex("mandiPrices", ["cityId"]);
  },
};
