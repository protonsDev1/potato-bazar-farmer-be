import { CS_REQUIREMENT_STATUS } from "../database/models/coldStorageRequirement";
import { NotificationType } from "../database/models/notification";
import User, { USER_ROLES } from "../database/models/user";
import {
  createRequirementAndInterests,
  deleteRequirementService,
  getRequirementByIdService,
  getRequirementsService,
  likeOrDislikeRequirementService,
  updateCSRequirementStatusService,
  updateRequirementService,
} from "../services/csRequirementService";
import { sendNotificationService } from "../services/notificationService";

export const getRequirements = async (req, res) => {
  try {
    const {
      page = 1,
      perPage = 10,
      listingType,
      commodityType,
      verified,
      district,
      pbVerified,
      isFavourite,
      status,
      sortBy,
    } = req.query;
    const userId = req.user.id;

    const result = await getRequirementsService(
      userId,
      Number(page),
      Number(perPage),
      listingType,
      { commodityType, verified, district, pbVerified, isFavourite, status },
      String(sortBy || "")
    );

    return res.status(200).json({
      success: true,
      message: "My requirements fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("Controller Error:", error);
    res.status(500).json({
      message: error.message || "Failed to fetch requirements",
    });
  }
};

export const createRequirementWithInterests = async (req, res) => {
  try {
    const requirementData = {
      ...req.body,
      createdBy: req.user.id,
    };

    // if (req.user.role !== USER_ROLES.USER) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Only Users are allowed to create cold storage requirements",
    //   });
    // }

    const requirement = await createRequirementAndInterests(requirementData);

    const superAdmin = await User.findOne({
      where: { role: USER_ROLES.SUPER_ADMIN },
    });

    await sendNotificationService({
      title: "Cold Storage Requirement",
      description: "New Cold Storage Requirement has been created.",
      senderId: req.user.id,
      receiverId: superAdmin.id,
      referenceType: NotificationType.COLD_STORAGE_REQUIREMENT,
      referenceId: requirement.id,
    });

    return res.status(201).json({
      success: true,
      message: "Cold storage requirement created successfully",
      data: requirement,
    });
  } catch (error) {
    console.error("Controller Error:", error);
    res.status(500).json({
      message: error.message || "Failed to create cold storage requirement",
    });
  }
};

export const getRequirementById = async (req, res) => {
  try {
    const result = await getRequirementByIdService(
      req.params.id,
      req.user.id,
      req.user.role
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Requirement not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Requirement fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("Get Requirement By Id Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch requirement",
    });
  }
};

export const updateRequirement = async (req, res) => {
  try {
    const result = await updateRequirementService(
      req.params.id,
      req.user,
      req.body
    );

    if (!result.success) {
      return res.status(result.statusCode).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Update Requirement Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update requirement",
    });
  }
};

export const deleteRequirement = async (req, res) => {
  try {
    const result = await deleteRequirementService(req.params.id, req.user.id);

    return res.status(result.statusCode).json(result);
  } catch (error) {
    console.error("Delete Requirement Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete requirement",
    });
  }
};

export const likeOrDislikeCSRequirement = async (req, res) => {
  try {
    const { id } = req.user;
    const { requirementId } = req.params;

    const response = await likeOrDislikeRequirementService(id, requirementId);

    if (!response.success)
      return res.status(400).json({ message: response.error });

    return res.status(200).json({ message: response.data });
  } catch (error) {
    console.error("Like or dislike Cold Storage Requirement error:", error);
    res.status(500).json({
      message: "Failed to like or dislike cold storage requirement",
      error: error.message,
    });
  }
};

export const updateCSRequirementStatus = async (req, res) => {
  try {
    const { requirementId } = req.params;
    const { status, reason } = req.body;
    const { id } = req.user;

    const updatedRequirement = await updateCSRequirementStatusService(
      requirementId,
      status,
      reason
    );

    if (!updatedRequirement) {
      return res
        .status(404)
        .json({ success: false, message: "Requirement not found" });
    }

    const description =
      status == CS_REQUIREMENT_STATUS.APPROVED
        ? `Your Cold Storage Requirement is ${status}`
        : updatedRequirement.reason;

    await sendNotificationService({
      title: `Your Cold Storage Requirement is ${status}`,
      description,
      senderId: id,
      receiverId: updatedRequirement.createdBy,
      referenceType: NotificationType.COLD_STORAGE_REQUIREMENT,
      referenceId: updatedRequirement.id,
    });

    return res.json({
      success: true,
      message: "Cold Storage Requirement status updated successfully",
      data: updatedRequirement,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
