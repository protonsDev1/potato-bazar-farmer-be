import { onboardFarmer, retrieveFarmersUnderAgent, retriveAllFarmers } from '../services/farmerServices';
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

export const getAllFarmers = async (req, res) => {
  try {
    const allFarmers = await retriveAllFarmers();

    return res.status(200).json({ message: allFarmers.response });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Failed in retreiving farmers." });
  }
};

export const getFarmersUnderAgent = async (req, res) => {
  try {
    const { role, id } = req.user;

    if (role !== "agent")
      return res
        .status(400)
        .json({
          message:
            "Only Agents are authorized to retrieve farmers under agent.",
        });

    const farmers = await retrieveFarmersUnderAgent(id);

    return res.status(200).json({ message: farmers.response });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: error.message || "Failed in retreiving farmers under agent.",
      });
  }
};

