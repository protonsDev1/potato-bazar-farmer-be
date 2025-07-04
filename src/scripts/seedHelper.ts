export const seedData = async (model, data, label) => {
  try {
    const count = await model.count();

    if (count !== 0) {
      await model.destroy({
        where: {},
        truncate: true,
        restartIdentity: true,
      });
    }

    await model.bulkCreate(data, {
      ignoreDuplicates: true,
    });

    console.log(`${label} inserted successfully.`);
  } catch (error) {
    console.error(`Error in seeding ${error}`);
  }
};
