import { NotificationType } from "../database/models/notification";
import { TRANSPORT_SERVICE_STATUS } from "../database/models/transportRequirement";
import User, { USER_ROLES } from "../database/models/user";

import { sendNotificationService } from "../services/notificationService";
import {
  createTransportRequirementAndInterests,
  deleteRequirementService,
  getTransportRequirementByIdService,
  getTransportRequirementsService,
  likeOrDislikeRequirementService,
  updateRequirementService,
  updateTransportRequirementStatusService,
} from "../services/transportRequirementService";
import { formatDate } from "../utils/dateFormat";

export const getTransportRequirements = async (req, res) => {
  try {
    const {
      page = 1,
      perPage = 10,
      listingType,
      district,
      pbVerified,
      isFavourite,
      status,
      sortBy,
    } = req.query;
    const userId = req.user.id;

    const result = await getTransportRequirementsService(
      userId,
      Number(page),
      Number(perPage),
      listingType,
      {
        district,
        pbVerified,
        isFavourite,
        status,
      },
      String(sortBy || ""),
    );

    return res.status(200).json({
      success: true,
      message: "My Transport requirements fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("Controller Error:", error);
    res.status(500).json({
      message: error.message || "Failed to fetch Transport requirements",
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

    const requirement =
      await createTransportRequirementAndInterests(requirementData);

    const superAdmin = await User.findOne({
      where: { role: USER_ROLES.SUPER_ADMIN },
    });

    await sendNotificationService({
      title: "New Transport Requirement Created",
      description: `A new Transport requirement (ID: ${
        requirement.requirementUid
      }) has been created for ${requirement.quantity} ${
        requirement.quantityUnit || ""
      }. Please review and verify the details.`,
      senderId: req.user.id,
      receiverId: superAdmin.id,
      referenceType: NotificationType.TRANSPORT_REQUIREMENT,
      referenceId: requirement.id,
    });

    return res.status(201).json({
      success: true,
      message: "Transport requirement created successfully",
      data: requirement,
    });
  } catch (error) {
    console.error("Controller Error:", error);
    res.status(500).json({
      message: error.message || "Failed to create Transport requirement",
    });
  }
};

export const getRequirementById = async (req, res) => {
  try {
    const result = await getTransportRequirementByIdService(
      req.params.id,
      req.user.id,
      req.user.role,
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
      req.params.requirementId,
      req.user,
      req.body,
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

export const likeOrDislikeTransportRequirement = async (req, res) => {
  try {
    const { id } = req.user;
    const { requirementId } = req.params;

    const response = await likeOrDislikeRequirementService(id, requirementId);

    if (!response.success)
      return res.status(400).json({ message: response.error });

    return res.status(200).json({ message: response.data });
  } catch (error) {
    console.error("Like or dislike Transport Requirement error:", error);
    res.status(500).json({
      message: "Failed to like or dislike transport requirement",
      error: error.message,
    });
  }
};

export const updateTransportRequirementStatus = async (req, res) => {
  try {
    const { requirementId } = req.params;
    const { status, reason } = req.body;
    const { id } = req.user;

    const updatedRequirement = await updateTransportRequirementStatusService(
      requirementId,
      status,
      reason,
    );

    if (!updatedRequirement) {
      return res
        .status(404)
        .json({ success: false, message: "Requirement not found" });
    }

    const description =
      status == TRANSPORT_SERVICE_STATUS.APPROVED
        ? `Your Transport requirement (ID: ${updatedRequirement.requirementUid}) has been approved. Our team will proceed with the next steps.`
        : `Your Transport requirement (ID: ${updatedRequirement.requirementUid}) was rejected. Reason: ${reason}.`;

    await sendNotificationService({
      title: `Your Transport Requirement is ${status}`,
      description,
      senderId: id,
      receiverId: updatedRequirement.createdBy,
      referenceType: NotificationType.TRANSPORT_REQUIREMENT,
      referenceId: updatedRequirement.id,
    });

    return res.json({
      success: true,
      message: "Transport Requirement status updated successfully",
      data: updatedRequirement,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
