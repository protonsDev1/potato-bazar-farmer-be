import AdminPotatoSubVarietyGrown from "../../database/models/adminModels/adminPotatoSubVariety";

interface PotatoSubVariety {
  name: string;
  position?: number;
}

interface UpdatePotatoSubVariety {
  name?: string;
  position?: number;
}

export const addPotatoSubVarietyService = async (
  potatoSubVariety: PotatoSubVariety
) => {
  try {
    await AdminPotatoSubVarietyGrown.create(potatoSubVariety);

    return { success: true };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getPotatoSubVarietyService = async () => {
  try {
    const res = await AdminPotatoSubVarietyGrown.findAll();

    return {
      success: true,
      data: res,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const updatePotatoSubVarietyService = async (
  data: UpdatePotatoSubVariety,
  id: number
) => {
  try {
    await AdminPotatoSubVarietyGrown.update({ ...data }, { where: { id } });

    return {
      success: true,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const deletePotatoSubVarietyService = async (id: number) => {
  try {
    await AdminPotatoSubVarietyGrown.destroy({ where: { id } });
    return {
      success: true,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};
