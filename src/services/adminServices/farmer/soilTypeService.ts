import AdminSoilType from "../../../database/models/adminModels/farmer/adminSoilType";

interface SoilType {
  name: string;
  position?: number;
  icon?: string;
}

interface UpdateSoilType {
  name?: string;
  position?: number;
  icon?: string;
}

export const addSoilTypeService = async (soilType: SoilType) => {
  try {
    await AdminSoilType.create(soilType);

    return { success: true };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getSoilTypeService = async () => {
  try {
    const data = await AdminSoilType.findAll();

    return {
      success: true,
      data,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const updateSoilTypeService = async (
  data: UpdateSoilType,
  id: number
) => {
  try {
    await AdminSoilType.update({ ...data }, { where: { id } });
    return {
      success: true,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const deleteSoilTypeService = async (id: number) => {
  try {
    await AdminSoilType.destroy({ where: { id } });
    return {
      success: true,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};
