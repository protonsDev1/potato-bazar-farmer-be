"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Convert existing disease values to an array format before altering the column
    await queryInterface.sequelize.query(`
      ALTER TABLE endorsements
      ALTER COLUMN disease DROP DEFAULT,
      ALTER COLUMN disease TYPE TEXT[]
      USING 
        CASE 
          WHEN disease IS NULL OR disease = '' THEN '{}'::text[]
          ELSE ARRAY[disease]::text[]
        END;
    `);

    await queryInterface.changeColumn("endorsements", "disease", {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: false,
      defaultValue: [],
    });

    await queryInterface.addColumn("endorsements", "isComman", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE endorsements
      ALTER COLUMN disease TYPE TEXT
      USING disease[1];
    `);

    await queryInterface.removeColumn("endorsements", "isComman");
  },
};
