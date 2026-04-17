import LikeTransportService from "../database/models/likeTransportService";
import { NotificationType } from "../database/models/notification";
import { TRANSPORT_SERVICE_STATUS } from "../database/models/transportRequirement";
import TransportService from "../database/models/transportService";
import TransportServiceView from "../database/models/transportServiceView";
import User, { USER_ROLES } from "../database/models/user";
import { sendNotificationService } from "../services/notificationService";

import {
  createTransport,
  getTransportService,
  updateTransport,
} from "../services/transportService";
import { canUpdateResource } from "../utils/commonCode";
import { PERMISSIONS } from "../utils/constants/permissions";

export const createTransportService = async (req, res) => {
  try {
    const { id: userId } = req.user;

    req.body.createdBy = userId;

    const response = await createTransport(req.body);

    const superAdmin = await User.findOne({
      where: { role: USER_ROLES.SUPER_ADMIN },
    });

    await sendNotificationService({
      title: `New Transport Service Registered.`,
      description: `A new Transport Service has been registered. Please review and verify its details.`,
      senderId: userId,
      referenceType: NotificationType.TRANSPORT_SERVICES,
      referenceId: response.data.id,
      receiverId: superAdmin.id,
    });

    return res.status(201).json({
      success: true,
      message: "Transport Service created successfully.",
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error in creating Transport Service.",
    });
  }
};

export const getTransportServiceListing = async (req, res) => {
  try {
    const {
      page = 1,
      perPage = 10,
      listingType = "all",
      pbVerified,
      status,
      transporterType,
      rateType,
      vehicleType,
      routeCoverage,
      search,
      isFavourite,
    } = req.query;

    const { id: userId } = req.user;

    const response = await getTransportService(
      userId,
      page,
      perPage,
      listingType,
      pbVerified,
      status,
      transporterType,
      rateType,
      vehicleType,
      routeCoverage,
      isFavourite,
      search,
    );

    return res.status(200).json({
      success: true,
      message: "Retrived Transport Services successfully.",
      data: response,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error in retrieving Transport Services.",
    });
  }
};

export const getTransportServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: userId, role } = req.user;

    const service = await TransportService.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: "creator",
          // attributes: [
          //   "id",
          //   "name",
          //   "role",
          //   "email",
          //   "mobile",
          //   "pbVerified",
          //   "profilePicture",
          // ],
        },
      ],
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Transport Service record not found.",
      });
    }

    if (role === USER_ROLES.USER) {
      await TransportServiceView.findOrCreate({
        where: { userId, serviceId: id },
        defaults: { userId, serviceId: id },
      });
    }

    const [viewCount, likeCount, likedRecord] = await Promise.all([
      TransportServiceView.count({
        where: { serviceId: id },
      }),
      LikeTransportService.count({
        where: { serviceId: id },
      }),
      LikeTransportService.findOne({
        where: { serviceId: id, userId },
      }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Retrieved Transport Service detail page successfully.",
      data: {
        ...service.toJSON(),
        viewCount,
        likeCount,
        isLiked: !!likedRecord,
        isOwner: service.createdBy === userId,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error.message || "Error in retrieving Transport Service detail page.",
    });
  }
};

export const updateStatusForTransportService = async (req, res) => {
  try {
    const { status, id, reason } = req.body;

    const response = await TransportService.findByPk(id);
    if (!response)
      return res.status(404).json({
        success: false,
        message: "Transport Service record not found.",
      });

    let description = "";

    if (status === TRANSPORT_SERVICE_STATUS.REJECTED) {
      await TransportService.update({ status, reason }, { where: { id } });
      description = `Transport Service has been ${status}, reason: ${reason}`;
    } else {
      await TransportService.update({ status }, { where: { id } });
      description = `Transport Service has been ${status}`;
    }

    const superAdmin = await User.findOne({
      where: { role: USER_ROLES.SUPER_ADMIN },
    });

    await sendNotificationService({
      title: "Transport Service status updated.",
      description,
      senderId: superAdmin.id,
      receiverId: response.createdBy,
      referenceType: NotificationType.TRANSPORT_SERVICES,
      referenceId: response.id,
    });

    return res.status(200).json({
      success: true,
      message: `Transport Service has been successfully ${status}.`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error.message || "Error in updating status for Transport Service.",
    });
  }
};

export const deleteTransportService = async (req, res) => {
  try {
    const record = await TransportService.findByPk(req.params.id);
    if (!record)
      return res.status(404).json({
        success: false,
        message: "Transport Service record not found.",
      });

    await record.destroy();

    return res.status(200).json({
      success: true,
      message: "Transport Service record deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error in deleting Transport Service.",
    });
  }
};

export const likeOrDislikeTransportService = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const serviceId = Number(req.params.id);

    if (!serviceId || isNaN(serviceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid serviceId",
      });
    }

    const transportService = await TransportService.findByPk(serviceId);

    if (!transportService) {
      return res.status(404).json({
        success: false,
        message: "Transport Service not found!",
      });
    }

    const existingLike = await LikeTransportService.findOne({
      where: { userId, serviceId },
    });

    if (existingLike) {
      await existingLike.destroy();

      return res.status(200).json({
        success: true,
        message: "Transport Service disliked successfully!",
      });
    }

    await LikeTransportService.create({ userId, serviceId });

    return res.status(200).json({
      success: true,
      message: "Transport Service liked successfully!",
    });
  } catch (error) {
    console.error("LIKE ERROR:", error); // log this

    return res.status(500).json({
      success: false,
      message: error.message || "Error in like/dislike Transport Service.",
    });
  }
};

export const updateTransportService = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const updatedRecord = await updateTransport(Number(id), userId, req.body);

    if (!updatedRecord.success) {
      return res.status(updatedRecord.statusCode).json({
        success: false,
        message: updatedRecord.error,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Transport Service updated successfully.",
      data: updatedRecord.data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error in updating Transport Service.",
    });
  }
};

export const updateTransportServiceAvailability = async (req, res) => {
  try {
    const { transportId } = req.params;
    const { isAvailable } = req.body;

    const transportService = await TransportService.findByPk(transportId);

    if (!transportService) {
      return res.status(404).json({ message: "Transport Service not found" });
    }

    const hasAccess = await canUpdateResource(
      req.user,
      transportService.createdBy,
      PERMISSIONS.TRANSPORT_SERVICE,
    );

    if (!hasAccess) {
      return res.status(403).json({
        message:
          "Only the owner, a super admin, or an authorized sub admin can update transport service availability.",
      });
    }

    transportService.isAvailable = isAvailable;
    await transportService.save();

    return res.status(200).json({
      message: "Transport Service availability updated successfully",
      data: {
        id: transportService.id,
        isAvailable: transportService.isAvailable,
      },
    });
  } catch (err) {
    console.error("Update Availability Error:", err);
    return res
      .status(500)
      .json({ message: err.message || "Failed to update availability" });
  }
};
