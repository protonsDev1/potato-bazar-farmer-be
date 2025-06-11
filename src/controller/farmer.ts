import Farmer from '../database/models/farmer';
import { onboardFarmer, retrieveFarmerProfile} from '../services/farmerServices';
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

export const getProfileOverview = async (req, res) => {
  try {
    const farmerId = req.params.farmerId;

    const { role, id } = req.user;

    const farmer = await Farmer.findOne({ where: { id: farmerId } });

    if (role !== "admin" && farmer.onBoardedBy !== id)
      return res
        .status(403)
        .json({
          message:
            "Only Agents those register the farmer or an Admin are authorized to view farmer's profile.",
        });

    const farmerData = await retrieveFarmerProfile(farmerId);

    return res.status(200).json({ message: farmerData });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: err.message || "Failed to retrieve profile of farmer" });
  }
};
