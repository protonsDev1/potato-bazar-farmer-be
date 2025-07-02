import ColdStorage from '../database/models/coldStorage';
import { onboardColdStorage, retrieveColdStorageProfile,getColdStorage } from '../services/coldStorageService';
import { findUserByPkInDB, updateUserInDB } from '../services/userServices';
import { parseFilters } from '../utils/parseQuery';

export const createColdStorage = async (req, res) => {
  try {
    const onBoardedBy = req.user.id;
    req.body.onBoardedBy=onBoardedBy;

    const user = await findUserByPkInDB(onBoardedBy);
    if (!user.success) {
      return res.status(400).json({ message: user.error});
    }

    await updateUserInDB(req.body.userId,{ownerName:req.body.ownerName});

    const coldStorage = await onboardColdStorage(req.body);
    res.status(201).json({
      message: "Cold Storage onboarded successfully",
      data: coldStorage,
    });
  } catch (error) {
    console.error("Controller Error:", error);
    res.status(500).json({ message: error.message || "Failed to onboard cold storage"});
  }
};

export const getColdStorageProfile = async (req, res) => {
  try {
    const coldStorageId = req.params.id;

    const { role, id } = req.user;

    const coldStorage = await ColdStorage.findOne({
      where: { id: coldStorageId },
    });

    if (role !== "admin" && coldStorage.onBoardedBy !== id)
      return res.status(403).json({
        message:
          "Only Agents those register the coldStorage or an Admin are authorized to view coldStorage's profile.",
      });

    const profileDetails = await retrieveColdStorageProfile(coldStorageId);

    return res.status(200).json({ message: profileDetails });
  } catch (error) {
    res
      .status(500)
      .json({
        message: error.message || "Failed to retrieve cold storage profile.",
      });
  }
};

export const getColdStorageList = async (req, res) => {
  try {
    const { page, perPage: limit, search } = req.query;

    const filters = parseFilters(req.query);

    const coldStorage = await getColdStorage(page, limit, filters, search);

    return res.status(200).json({
      message: "Cold storage list",
      data: coldStorage,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: error.message || "Failed to retrieve cold storage list",
      });
  }
};

export const selfOnboardColdStorage=async(req,res)=>{
  try{
  const onBoardedBy = req.body.userId
    req.body.onBoardedBy=onBoardedBy;

    const user = await findUserByPkInDB(onBoardedBy);
    if (!user.success) {
      return res.status(400).json({ message: user.error});
    }

    await updateUserInDB(req.body.userId,{ownerName:req.body.ownerName});

    const selfOnboard = await onboardColdStorage(req.body);
    res.status(201).json({
      message: "Cold Storage self onboarded successfully",
      data: selfOnboard,
    });
  }
  catch(error)
  {
     res
      .status(500)
      .json({
        message: error.message || "Failed to self onboard cold storage",
      });
  }
}