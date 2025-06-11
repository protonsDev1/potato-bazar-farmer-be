import AdminBiggestChallengeInSelling from "../../database/models/adminModels/adminBiggestChallengeInSelling";

interface BiggestChallengeInSelling {
  name: string;
  position?: number;
}

interface UpdateBiggestChallengeInSelling {
  name?: string;
  position?: number;
}

export const addBiggestChallengeInSellingService = async (
  biggestChallengeInSelling: BiggestChallengeInSelling
) => {
  try {
    await AdminBiggestChallengeInSelling.create(biggestChallengeInSelling);

    return { success: true };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getBiggestChallengeInSellingService = async () => {
  try {
    const data = await AdminBiggestChallengeInSelling.findAll();

    return {
      success: true,
      data,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const updateBiggestChallengeInSellingService = async (
  data: UpdateBiggestChallengeInSelling,
  id: number
) => {
  try {
    await AdminBiggestChallengeInSelling.update({ ...data }, { where: { id } });
    return {
      success: true,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const deleteBiggestChallengeInSellingService = async (id: number) => {
  try {
    await AdminBiggestChallengeInSelling.destroy({ where: { id } });
    return {
      success: true,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};
