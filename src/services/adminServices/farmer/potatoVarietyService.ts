import AdminPotatoVarietyGrown from "../../../database/models/adminModels/farmer/adminPotatoVarietyGrown";

interface PotatoVariety {
  name: string;
  position?: number;
}

interface UpdatePotatoVariety {
  name?: string;
  position?: number;
}

export const addPotatoVarietyService = async (potatoVariety: PotatoVariety) => {
  try {
    await AdminPotatoVarietyGrown.create(potatoVariety);

    return { success: true };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getPotatoVarietyService = async () => {
  try {
    const res = await AdminPotatoVarietyGrown.findAll();

    return {
      success: true,
      data: res,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const updatePotatoVarietyService = async (
  data: UpdatePotatoVariety,
  id: number
) => {
  try {
    await AdminPotatoVarietyGrown.update({ ...data }, { where: { id } });

    return {
      success: true,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const deletePotatoVarietyService = async (id: number) => {
  try {
    await AdminPotatoVarietyGrown.destroy({ where: { id } });
    return {
      success: true,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};
