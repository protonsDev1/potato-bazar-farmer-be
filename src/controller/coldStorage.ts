import ExcelJS from "exceljs";

import ColdStorage from '../database/models/coldStorage';
import { onboardColdStorage, retrieveColdStorageProfile,getColdStorage, updateColdStorageService, softDeleteColdStorageById, getAllColdStoragesWithAssociations, createColdStorageWorksheetColumns, addColdStoragesToWorksheet } from '../services/coldStorageService';
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


export const updateColdStorage = async (req, res) => {
  try {
    const { coldStorageId } = req.params;
    const { role, id } = req.user;
    const payload = req.body;

    const coldStorage = await ColdStorage.findOne({ where: { id: coldStorageId, isDeleted: false } });
    if (!coldStorage) {
      return res.status(404).json({ message: 'Cold storage not found' });
    }

    if (role !== 'admin' && role !== 'agent') {
      return res.status(403).json({ message: 'Only Admins and Agents are authorized to update cold storage profiles.' });
    }

    if (role === 'agent') {
      const isOnboardedByAgent = coldStorage.onBoardedBy === id;
      const isWithin24Hours = Date.now() - new Date(coldStorage.createdAt).getTime() <= 24 * 60 * 60 * 1000;

      if (!isOnboardedByAgent || !isWithin24Hours) {
        return res.status(403).json({ message: 'Only Admins or the Agent who onboarded the cold storage within the last 24 hours can update the profile.' });
      }
    }

    if (payload.ownerName && coldStorage.userId) {
      await updateUserInDB(coldStorage.userId, { name: payload.ownerName });
    }

    const updatedColdStorage = await updateColdStorageService(coldStorageId, payload);

    return res.status(200).json({ message: 'Cold Storage updated successfully', data: updatedColdStorage });
  } catch (err) {
    console.error('Update Cold Storage Error:', err);
    return res.status(500).json({ message: err.message || 'Failed to update cold storage' });
  }
};

export const getColdStorageProfile = async (req, res) => {
  try {
    const coldStorageId = req.params.id;

    const { role, id } = req.user;

    const coldStorage = await ColdStorage.findOne({
      where: { id: coldStorageId, isDeleted: false },
    });

    if (role !== "admin" && coldStorage.onBoardedBy !== id)
      return res.status(403).json({
        message:
          "Only Agents those register the coldStorage or an Admin are authorized to view coldStorage's profile.",
      });

    let isWithin24Hours = true;

    if (role === "agent") {
      isWithin24Hours =
        Date.now() - new Date(coldStorage.createdAt).getTime() <=
        24 * 60 * 60 * 1000;
    }

    const profileDetails = await retrieveColdStorageProfile(
      coldStorageId,
      isWithin24Hours
    );

    return res.status(200).json({ message: profileDetails });
  } catch (error) {
    res.status(500).json({
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

export const deleteColdStorage = async (req, res) => {
  try {
    const result = await softDeleteColdStorageById(req.params.id);
    if (!result.success) {
      return res
        .status(result.status)
        .json({ success: false, message: result.message });
    }

    return res
      .status(200)
      .json({ success: true, message: "Cold Storage deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Failed to delete cold storage",
    });
  }
};

export const exportColdStorages = async (req, res) => {
  try {
    const userRole = req.user?.role;

    if (userRole !== "admin") {
      return res.status(403).json({ message: "Only admin can export data." });
    }

    const filters = parseFilters(req.query);
    const search = req.query.search || "";

    const coldStorages = await getAllColdStoragesWithAssociations(filters, search);

    if (!coldStorages.length) {
      return res.status(404).json({ message: "No cold storages found." });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Cold Storages");

    createColdStorageWorksheetColumns(worksheet);
    addColdStoragesToWorksheet(coldStorages, worksheet);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=cold_storages.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Cold Storage export error:", error);
    res.status(500).json({
      message: "Failed to export cold storages",
      error: error.message,
    });
  }
};