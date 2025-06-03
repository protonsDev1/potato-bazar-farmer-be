import { getColdStorage, onboardColdStorage } from '../services/coldStorageService';

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

export const getColdStorageList = async (req, res) => {
  try{
    const page =  req.query.page? req.query.page: 1;
    const limit =  req.query.limit? req.query.limit: 10;
    const coldStorage = await getColdStorage(page, limit);
    res.status(200).json({
      message: "Get Cold storage list",
      data: coldStorage
    });
  }
  catch (error) {
    console.error("Controller Error:", error);
    res.status(500).json({ message: "Failed to get cold storage list" });
  }
}
