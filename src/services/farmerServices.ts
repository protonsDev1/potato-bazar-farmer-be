import Farmer from '../database/models/farmer';

export const createFarmerInDB = async (data: any) => {
  return await Farmer.create(data);
};
