import AdminIrrigationSource from "../../database/models/adminIrrigationSource";

interface IrrigationSource {
  name_en: string;
  name_hi: string;
  position?: number;
  icon?: string;
}

interface UpdateIrigationSource {
  name_en?: string;
  name_hi?: string;
  position?: number;
  icon?: string;
}

export const addIrrigationService = async (
  irrigationSource: IrrigationSource
) => {
  try {
    await AdminIrrigationSource.create(irrigationSource);

    return { success: true };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getIrrigationSourceService = async () => {
  try {
    const res = await AdminIrrigationSource.findAll();

    return {
      success: true,
      data: res,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const updateIrrigationSourceService = async (
  data: UpdateIrigationSource,
  id: number
) => {
  try {
    await AdminIrrigationSource.update({ ...data }, { where: { id } });

    return {
      success: true,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const deleteIrrigationSourceService = async (id: number) => {
  try {
    await AdminIrrigationSource.destroy({ where: { id } });
    return {
      success: true,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};
