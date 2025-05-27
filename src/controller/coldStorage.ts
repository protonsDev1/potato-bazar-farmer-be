import { createColdStorageInDB } from '../services/coldStorageService';

export const createColdStorage = async (req, res) => {
  try {
    const userId = req.user.id;
    req.body.onBoardedBy = userId;
    const coldStorage = await createColdStorageInDB(req.body);
    return res.status(201).json({ message: 'Cold Storage created', coldStorage });
  } catch (err: any) {
    return res.status(500).json({ message: err.message || 'Failed to create cold storage' });
  }
};
