import {
  onboardDirectory,
  updateDirectoryService,
  retrieveDirectoryProfile,
  getDirectoryListByAdmin,
  deleteDirectoryById,
  toggleSaveDirectoryService,
  getDirectoryPlansService,
  updateDirectoryStatusService,
} from "../services/directoryService";
import { findUserByPkInDB } from "../services/userServices";
import { REGISTRATION_STATUS, USER_ROLES } from "../database/models/user";
import Directory from "../database/models/directory";
import { parseFilters } from "../utils/parseQuery";
import DirectoryPlan from "../database/models/directoryPlan";

export const createDirectory = async (req, res) => {
  try {
    const userId = req.user.id;
    req.body.onBoardedBy = userId;

    const user = await findUserByPkInDB(userId);
    if (!user.success) return res.status(400).json({ message: user.error });

    if (!req.body.planId)
      return res.status(400).json({ message: "planId is required" });
    const plan = await DirectoryPlan.findByPk(req.body.planId);
    if (!plan) return res.status(400).json({ message: "Invalid planId" });

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
    const userId = req.body?.userId;
    req.body.onBoardedBy = userId;

    const pbFree = await DirectoryPlan.findOne({
      where: { name: "PB Free" },
    });
    if (!pbFree)
      return res.status(500).json({ message: "PB Free plan not found" });

    req.body.planId = pbFree.id;
    req.body.status = REGISTRATION_STATUS.PENDING;
    delete req.body.planStartDate;
    delete req.body.planEndDate;

    // const user = await findUserByPkInDB(userId);
    // if (!user.success) return res.status(400).json({ message: user.error });

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

    if (payload.planId) {
      const plan = await DirectoryPlan.findByPk(payload.planId);
      if (!plan) return res.status(400).json({ message: "Invalid planId" });
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

    const directory = await Directory.findOne({ where: { id: directoryId } });
    if (!directory)
      return res.status(404).json({ message: "Directory not found" });

    const directoryData = await retrieveDirectoryProfile(
      directoryId,
      req.user?.id
    );
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
    const filters = parseFilters(req.query);

    const directoryList = await getDirectoryListByAdmin(
      page,
      perPage,
      filters,
      search,
      sortBy,
      req.user?.id
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

export const toggleSaveDirectory = async (req, res) => {
  try {
    const userId = req.user.id;
    const directoryId = Number(req.params.directoryId);

    const dir = await Directory.findByPk(directoryId);
    if (!dir)
      return res
        .status(404)
        .json({ success: false, message: "Directory not found" });

    const result: any = await toggleSaveDirectoryService(userId, directoryId);

    if (!result.success) return res.status(result.status || 400).json(result);

    const status = result.action === "saved" ? 201 : 200;
    const responseData = result.action === "saved" ? result.data : null;

    return res.status(status).json({
      success: true,
      action: result.action,
      data: responseData,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getDirectoryPlans = async (req, res) => {
  try {
    const plans = await getDirectoryPlansService();
    return res.status(200).json({ success: true, data: plans });
  } catch (err) {
    console.error("getDirectoryPlans error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch plans",
    });
  }
};

export const updateDirectoryStatus = async (req, res) => {
  try {
    const { directoryId } = req.params;
    const { status, reason } = req.body;
    const currentUser = req.user;

    const result: any = await updateDirectoryStatusService({
      directoryId: Number(directoryId),
      status,
      reason: reason ? String(reason).trim() : null,
      currentUserId: currentUser.id,
    });

    if (!result || result.success === false) {
      const code = result && result.statusCode ? result.statusCode : 500;
      const msg =
        result && result.message
          ? result.message
          : "Failed to update directory status";
      return res.status(code).json({ message: msg });
    }

    const response = {
      message: `Directory status updated to ${status}`,
      directory: result.directory,
    };

    return res.status(200).json(response);
  } catch (err) {
    console.error("updateDirectoryStatus error:", err);
    return res.status(500).json({
      message:
        err && err.message ? err.message : "Failed to update directory status",
    });
  }
};
