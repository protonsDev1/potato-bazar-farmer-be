import ColdStorage from '../database/models/coldStorage';
import { onboardColdStorage, retrieveColdStorageProfile } from '../services/coldStorageService';

export const createColdStorage = async (req, res) => {
  try {
    const onBoardedBy = req.user.id;
    req.body.onBoardedBy=onBoardedBy;

    const coldStorage = await onboardColdStorage(req.body);
    res.status(201).json({
      message: "Cold Storage onboarded successfully",
      data: coldStorage,
    });
  } catch (error) {
    console.error("Controller Error:", error);
    res.status(500).json({ message: "Failed to onboard cold storage" });
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
      .json({ message: "Failed to retrieve cold storage profile." });
  }
};

