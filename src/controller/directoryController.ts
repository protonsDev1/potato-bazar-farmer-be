import {
  onboardDirectory,
  updateDirectoryService,
  retrieveDirectoryProfile,
  getDirectoryListByAdmin,
  deleteDirectoryById,
  validateCategoryMappingsPayload,
} from "../services/directoryService";
import { findUserByPkInDB, updateUserInDB } from "../services/userServices";
import { REGISTRATION_STATUS, USER_ROLES } from "../database/models/user";
import Directory from "../database/models/directory";

export const createDirectory = async (req, res) => {
  try {
    const userId = req.user.id;
    req.body.onBoardedBy = userId;

    const user = await findUserByPkInDB(userId);
    if (!user.success) return res.status(400).json({ message: user.error });

    if (req.body.categoryMappings) {
      const validation = validateCategoryMappingsPayload(
        req.body.categoryMappings
      );
      if (!validation.ok)
        return res.status(400).json({ message: validation.message });
    }

    const directory = await onboardDirectory(req.body);
    return res.status(201).json({ message: "Directory created", directory });
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message || "Failed to create directory" });
  }
};

export const selfOnboardedDirectory = async (req, res) => {
  try {
    const userId = req.body.userId;
    req.body.onBoardedBy = userId;

    const user = await findUserByPkInDB(userId);
    if (!user.success) return res.status(400).json({ message: user.error });

    if (req.body.categoryMappings) {
      const validation = validateCategoryMappingsPayload(
        req.body.categoryMappings
      );
      if (!validation.ok)
        return res.status(400).json({ message: validation.message });
    }

    const directory = await onboardDirectory(req.body);
    return res
      .status(201)
      .json({ message: "Directory self onboarded successfully", directory });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to self onboard directory" });
  }
};

export const updateDirectory = async (req, res) => {
  try {
    const { directoryId } = req.params;
    const payload = req.body;
    const { role, id } = req.user;

    const directory = await Directory.findOne({ where: { id: directoryId } });
    if (!directory)
      return res.status(404).json({ message: "Directory not found" });

    if (
      role === USER_ROLES.USER &&
      directory.status === REGISTRATION_STATUS.APPROVED
    ) {
      return res.status(403).json({ message: "Directory already approved" });
    }

    if (payload.categoryMappings) {
      const validation = validateCategoryMappingsPayload(
        payload.categoryMappings
      );
      if (!validation.ok)
        return res.status(400).json({ message: validation.message });
    }

    const updatedDirectory = await updateDirectoryService(directoryId, payload);
    return res.status(200).json({
      message: "Directory updated successfully",
      directory: updatedDirectory,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message || "Failed to update directory" });
  }
};

export const getDirectoryDetail = async (req, res) => {
  try {
    const { directoryId } = req.params;
    const { role, id } = req.user;

    const directory = await Directory.findOne({ where: { id: directoryId } });
    if (!directory)
      return res.status(404).json({ message: "Directory not found" });

    if (
      role !== USER_ROLES.SUPER_ADMIN &&
      role !== USER_ROLES.SUB_ADMIN &&
      directory.onBoardedBy !== id
    )
      return res
        .status(403)
        .json({ message: "Unauthorized to view this profile" });

    const directoryData = await retrieveDirectoryProfile(directoryId);
    return res.status(200).json({
      message: "Fetched directory profile overview",
      directory: directoryData,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message || "Failed to retrieve directory profile" });
  }
};

export const getDirectoryList = async (req, res) => {
  try {
    const { page, perPage, search, sortBy } = req.query;
    const filters = req.query;

    const directoryList = await getDirectoryListByAdmin(
      page,
      perPage,
      filters,
      search,
      sortBy
    );
    return res
      .status(200)
      .json({ message: "Directory List", data: directoryList });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to get Directory List" });
  }
};

export const deleteDirectory = async (req, res) => {
  try {
    const result = await deleteDirectoryById(req.params.id);
    if (!result.success)
      return res
        .status(result.status)
        .json({ success: false, message: result.message });

    return res
      .status(200)
      .json({ success: true, message: "Directory deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to delete directory" });
  }
};
