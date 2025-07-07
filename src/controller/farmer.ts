import Farmer from '../database/models/farmer';
import { onboardFarmer, retrieveFarmerProfile, getFarmerListByAdmin, updateFarmerDetails} from '../services/farmerServices';
import { findUserByPkInDB, updateUserInDB } from '../services/userServices';
import { parseFilters } from '../utils/parseQuery';

export const createFarmer = async (req, res) => {
  try {
     const userId = req.user.id;
    req.body.onBoardedBy = userId;

    const user = await findUserByPkInDB(userId);
    if (!user.success) {
      return res.status(400).json({ message: user.error});
    }
    
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

    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }
    
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

export const updateFarmer = async (req, res) => {
  try {
    const { farmerId } = req.params;
    const { role, id } = req.user;
    const payload = req.body;

    const farmer = await Farmer.findByPk(farmerId);
    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }

    if (role !== "admin" && role !== "agent") {
      return res.status(403).json({
        message: "Only Admins and Agents are authorized to update farmer profiles.",
      });
    }

    if (role === "agent") {
      const isOnboardedByAgent = farmer.onBoardedBy === id;
      const isWithin24Hours =
        Date.now() - new Date(farmer.createdAt).getTime() <= 24 * 60 * 60 * 1000;

      if (!isOnboardedByAgent || !isWithin24Hours) {
        return res.status(403).json({
          message:
            "Only Admins or the Agent who onboarded the farmer within the last 24 hours can update the profile.",
        });
      }
    }
        
    await updateUserInDB(farmer.userId, { name: payload.name });

    const updatedFarmer = await updateFarmerDetails(farmerId, payload);
    return res.status(200).json({ message: "Farmer updated successfully", farmer: updatedFarmer });
  } catch (err) {
    console.error("Update Farmer Error:", err);
    return res.status(500).json({ message: err.message || "Failed to update farmer" });
  }
};

export const getFarmerList = async (req, res) => {
  try {
    const { page, perPage: limit, search } = req.query;

    const filters = parseFilters(req.query);

    const farmerList = await getFarmerListByAdmin(page, limit, filters,search);

    return res.status(200).json({
      message: "Farmer List",
      data: farmerList,
    });
  } catch (error) {
    console.error("Controller Error:", error);
    res.status(500).json({ message: error.message || "Failed to get Farmer List" });
  }
};

export const selfOnboardFarmer = async (req, res) => {
  try {
    const userId = req.body.userId;
    req.body.onBoardedBy = userId;

    const user = await findUserByPkInDB(userId);
    if (!user) {
      return res.status(400).json({ error: "User not found." });
    }

    await updateUserInDB(req.body.userId, { name: req.body.name });

    const farmer = await onboardFarmer(req.body);

    return res
      .status(201)
      .json({ message: "Farmer self onboarded successfully.", farmer });
  } catch (error) {
    console.error("Controller Error:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to self onboard farmer." });
  }
};
