import { getFarmerListByAdmin, onboardFarmer } from '../services/farmerServices';
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

export const getFarmerList = async (req, res) => {
  try{
    const page =  req.query.page? req.query.page: 1;
    const limit =  req.query.limit? req.query.limit: 10;
    const farmerList = await getFarmerListByAdmin(page, limit);
    res.status(200).json({
      message: "Get Farmer List",
      data: farmerList
    });
  }
  catch (error) {
    console.error("Controller Error:", error);
    res.status(500).json({ message: "Failed to get Farmer List" });
  }
}

