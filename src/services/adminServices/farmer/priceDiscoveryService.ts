import AdminPriceDiscovery from "../../../database/models/adminModels/farmer/adminPriceDiscovery";

interface PriceDiscovery {
  name: string;
  position?: number;
}

interface UpdatePriceDiscovery {
  name?: string;
  position?: number;
}

export const addPriceDiscoveryService = async (
  priceDiscovery: PriceDiscovery
) => {
  try {
    await AdminPriceDiscovery.create(priceDiscovery);

    return { success: true };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getPriceDiscoveryService = async () => {
  try {
    const data = await AdminPriceDiscovery.findAll();

    return {
      success: true,
      data,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const updatePriceDiscoveryService = async (
  data: UpdatePriceDiscovery,
  id: number
) => {
  try {
    await AdminPriceDiscovery.update({ ...data }, { where: { id } });
    return {
      success: true,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const deletePriceDisoveryService = async (id: number) => {
  try {
    await AdminPriceDiscovery.destroy({ where: { id } });
    return {
      success: true,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};
