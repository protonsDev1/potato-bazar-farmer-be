import { onboardFarmer } from '../services/farmerServices';
import { updateUserInDB } from '../services/userServices';

export const createFarmer = async (req, res) => {
  try {
     const userId = req.user.id;
    req.body.onBoardedBy = userId;
    await updateUserInDB(req.body.userId,{name:req.body.name})
    const farmer = await onboardFarmer(req.body);
    return res.status(201).json({ message: 'Farmer created', farmer });
  } catch (err: any) {
    return res.status(500).json({ message: err.message || 'Failed to create farmer' });
  }
};


