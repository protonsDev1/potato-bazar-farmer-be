import { onboardColdStorage } from '../services/coldStorageService';

export const createColdStorage = async (req, res) => {
  try {
    const onBoardedBy = req.body.id;
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
