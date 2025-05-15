import { createFarmerInDB } from '../services/farmerServices';

export const createFarmer = async (req, res) => {
  try {
    const farmer = await createFarmerInDB(req.body);
    return res.status(201).json({ message: 'Farmer created', farmer });
  } catch (err: any) {
    return res.status(500).json({ message: err.message || 'Failed to create farmer' });
  }
};
