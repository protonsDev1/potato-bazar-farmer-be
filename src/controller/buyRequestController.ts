import { BUY_REQUEST_STATUS } from "../database/models/buyRequest";
import { NotificationType } from "../database/models/notification";
import User, { USER_ROLES } from "../database/models/user";
import {
  createBuyRequestService,
  deleteBuyRequestService,
  getBuyRequestByIdService,
  listAdminBuyRequestsService,
  listBuyRequestsService,
  listMyBuyRequestsService,
  updateBuyRequestService,
  updateBuyRequestStatusService,
} from "../services/buyRequestService";
import {
  sendNotificationService,
  sendNotificationToMatchingSellers,
} from "../services/notificationService";
import { formatDate } from "../utils/dateFormat";

export const createBuyRequest = async (req, res) => {
  try {
    // if (req.user.role !== USER_ROLES.USER)
    //   return res.status(403).json({
    //     message: "Only user is authorized to create buy request.",
    //   });

    const buyRequest = await createBuyRequestService(req.user.id, req.body);

    const superAdmin = await User.findOne({
      where: { role: USER_ROLES.SUPER_ADMIN },
    });

    await sendNotificationService({
      title: `New Buy Request Created - ${buyRequest.potatoType} (${buyRequest.potatoVariety})`,
      description: `A new buy request (ID: ${buyRequest.requestId}) has been created for ${buyRequest.quantity} ${buyRequest.unit} of ${buyRequest.potatoVariety} potatoes.`,
      senderId: req.user.id,
      receiverId: superAdmin.id,
      referenceType: NotificationType.BUY,
      referenceId: buyRequest.id,
    });

    return res.status(201).json({
      success: true,
      message: "Buy request created successfully",
      data: buyRequest,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const listBuyRequests = async (req, res) => {
  try {
    const requests = await listBuyRequestsService(req.query, req.user?.id);
    return res.json({
      success: true,
      message: "Buy Requests fetched successfully",
      data: requests,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const listMyBuyRequests = async (req, res) => {
  try {
    const requests = await listMyBuyRequestsService(req.user.id, req.query);
    return res.json({
      success: true,
      message: "My Buy Request listing fetched successfully",
      data: requests,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const listAdminBuyRequests = async (req, res) => {
  try {
    const requests = await listAdminBuyRequestsService(req.query);
    return res.json({
      success: true,
      message: "Buy Requests fetched successfully",
      data: requests,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const showBuyRequest = async (req, res) => {
  try {
    const request = await getBuyRequestByIdService(
      req.params.id,
      req.user?.id,
      req.user?.role
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Buy request not found",
      });
    }

    return res.json({
      success: true,
      message: "Buy request fetched successfully",
      data: request,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteBuyRequest = async (req, res) => {
  try {
    const result = await deleteBuyRequestService(req.user, req.params.id);

    return res.status(result.statusCode).json(result);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateBuyRequest = async (req, res) => {
  const result = await updateBuyRequestService(
    req.user,
    req.params.id,
    req.body
  );

  return res.status(result.statusCode).json(result);
};

export const updateBuyRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, reason } = req.body;
    const { id } = req.user;

    const updatedRequest = await updateBuyRequestStatusService(
      requestId,
      status,
      reason
    );

    if (!updatedRequest) {
      return res
        .status(404)
        .json({ success: false, message: "Buy Request not found" });
    }

    const description =
      status == BUY_REQUEST_STATUS.APPROVED
        ? `Your buy request (ID: ${updatedRequest.requestId}) has been approved. Our team will now proceed with arranging the required supply.`
        : `Your buy request (ID: ${updatedRequest.requestId}) has been rejected. Reason: ${updatedRequest.reason}.`

    await sendNotificationService({
      title: `Your Buy Request is ${status}`,
      description,
      senderId: id,
      receiverId: updatedRequest.userId,
      referenceType: NotificationType.BUY,
      referenceId: updatedRequest.id,
    });

    if (
      status === BUY_REQUEST_STATUS.APPROVED &&
      updatedRequest.isActive === true
    )
      await sendNotificationToMatchingSellers(id, updatedRequest.id);

    return res.json({
      success: true,
      message: "Buy Request status updated successfully",
      data: updatedRequest,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
