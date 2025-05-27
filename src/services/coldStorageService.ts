import ColdStorage from '../database/models/coldStorage';

export const createColdStorageInDB = async (data: any) => {
  return await ColdStorage.create(data);
};
