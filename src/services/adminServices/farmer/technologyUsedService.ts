import AdminTechnologyUsed from "../../../database/models/adminModels/farmer/adminTechnologyUsed";

interface TechnologyUsed {
  name: string;
  position?: number;
}

interface UpdateTechnologyUsed {
  name?: string;
  position?: number;
}

export const addTechnologyUsedService = async (
  technologyUsed: TechnologyUsed
) => {
  try {
    await AdminTechnologyUsed.create(technologyUsed);

    return { success: true };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getTechnologyUsedService = async () => {
  try {
    const data = await AdminTechnologyUsed.findAll();

    return {
      success: true,
      data,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const updateTechnologyUsedService = async (
  data: UpdateTechnologyUsed,
  id: number
) => {
  try {
    await AdminTechnologyUsed.update({ ...data }, { where: { id } });
    return {
      success: true,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const deleteTechnologyUsedService = async (id: number) => {
  try {
    await AdminTechnologyUsed.destroy({ where: { id } });
    return {
      success: true,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};
