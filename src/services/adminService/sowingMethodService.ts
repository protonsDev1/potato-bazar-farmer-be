import AdminSowingMethod from "../../database/models/adminModels/adminSowingMethod";

interface SowingMethod {
  name: string;
  position?: number;
}

interface UpdateSowingMethod {
  name?: string;
  position?: number;
}

export const addSowingMethodService = async (sowingMethod: SowingMethod) => {
  try {
    await AdminSowingMethod.create(sowingMethod);

    return { success: true };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getSowingMethodService = async () => {
  try {
    const data = await AdminSowingMethod.findAll();

    return {
      success: true,
      data,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const updateSowingMethodService = async (
  data: UpdateSowingMethod,
  id: number
) => {
  try {
    await AdminSowingMethod.update({ ...data }, { where: { id } });
    return {
      success: true,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const deleteSowingMethodService = async (id: number) => {
  try {
    await AdminSowingMethod.destroy({ where: { id } });
    return {
      success: true,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};
