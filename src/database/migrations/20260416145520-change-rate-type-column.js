"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE "transportServices"
      ALTER COLUMN "rateType" TYPE TEXT[]
      USING 
        CASE 
          WHEN "rateType" IS NULL THEN NULL
          ELSE ARRAY["rateType"]
        END;
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE "transportServices"
      ALTER COLUMN "rateType" TYPE TEXT
      USING 
        CASE 
          WHEN "rateType" IS NULL THEN NULL
          ELSE "rateType"[1]
        END;
    `);
  },
};
