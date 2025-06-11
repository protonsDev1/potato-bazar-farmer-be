import AdminFarmEquipmentUsed from "../../database/models/adminModels/adminFarmEquipmentUsed";

interface FarmEquipment {
  name: string;
  position?: number;
  icon?: string;
}

interface UpdateFarmEquipment {
  name?: string;
  position?: number;
  icon?: string;
}

export const addFarmEquipmentService = async (farmEquipment: FarmEquipment) => {
  try {
    await AdminFarmEquipmentUsed.create(farmEquipment);

    return { success: true };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getFarmEquipmentService = async () => {
  try {
    const data = await AdminFarmEquipmentUsed.findAll();

    return {
      success: true,
      data,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const updateFarmEquipmentService = async (
  data: UpdateFarmEquipment,
  id: number
) => {
  try {
    await AdminFarmEquipmentUsed.update({ ...data }, { where: { id } });
    return {
      success: true,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const deleteFarmEquipmentService = async (id: number) => {
  try {
    await AdminFarmEquipmentUsed.destroy({ where: { id } });
    return {
      success: true,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};
