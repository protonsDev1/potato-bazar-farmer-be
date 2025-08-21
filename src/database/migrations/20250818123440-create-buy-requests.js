module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("buyRequests", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
      },
      requestId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      potatoType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      potatoVariety: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      unit: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      targetPrice: {
        type: Sequelize.FLOAT,
      },
      requiredByDate: {
        type: Sequelize.DATE,
      },
      qualityGrade: {
        type: Sequelize.STRING,
      },
      packagingType: {
        type: Sequelize.STRING,
      },
      delivery: {
        type: Sequelize.STRING,
      },
      size: {
        type: Sequelize.FLOAT,
      },
      sugarContent: {
        type: Sequelize.STRING,
      },
      skinSet: {
        type: Sequelize.STRING,
      },
      fleshColor: {
        type: Sequelize.STRING,
      },
      shape: {
        type: Sequelize.STRING,
      },
      soilAdherence: {
        type: Sequelize.STRING,
      },
      firmness: {
        type: Sequelize.STRING,
      },
      sproutingStatus: {
        type: Sequelize.STRING,
      },
      organicCerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: "Pending",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("buyRequests");
  },
};
