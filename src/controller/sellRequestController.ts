import { NotificationType } from "../database/models/notification";
import { SELL_REQUEST_STATUS } from "../database/models/sellRequest";
import User, { USER_ROLES } from "../database/models/user";
import {
  sendNotificationService,
  sendNotificationToMatchingBuyers,
} from "../services/notificationService";
import {
  createSellRequestService,
  deleteSellRequestService,
  getSellRequestByIdService,
  listAdminSellRequestsService,
  listSellRequestsService,
  listMySellRequestsService,
  updateSellRequestService,
  updateSellRequestStatusService,
} from "../services/sellRequestService";

export const createSellRequest = async (req, res) => {
  try {
    if (req.user.role !== USER_ROLES.USER)
      return res.status(403).json({
        message: "Only user is authorized to create sell request.",
      });

    const sellRequest = await createSellRequestService(req.user.id, req.body);

    const superAdmin = await User.findOne({
      where: { role: USER_ROLES.SUPER_ADMIN },
    });

    await sendNotificationService({
      title: "Sell Request",
      description: "New Sell Request has been created.",
      senderId: req.user.id,
      receiverId: superAdmin.id,
      referenceType: NotificationType.SELL,
      referenceId: sellRequest.id,
    });

    return res.status(201).json({
      success: true,
      message: "Sell request created successfully",
      data: sellRequest,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const listSellRequests = async (req, res) => {
  try {
    const requests = await listSellRequestsService(req.query, req.user?.id);
    return res.json({
      success: true,
      message: "Sell Requests fetched successfully",
      data: requests,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const listMySellRequests = async (req, res) => {
  try {
    const requests = await listMySellRequestsService(req.user.id, req.query);
    return res.json({
      success: true,
      message: "My Sell Request listing fetched successfully",
      data: requests,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const listAdminSellRequests = async (req, res) => {
  try {
    const requests = await listAdminSellRequestsService(req.query);
    return res.json({
      success: true,
      message: "Sell Requests fetched successfully",
      data: requests,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const showSellRequest = async (req, res) => {
  try {
    const request = await getSellRequestByIdService(
      req.params.id,
      req.user?.id,
      req.user?.role
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Sell request not found",
      });
    }

    return res.json({
      success: true,
      message: "Sell request fetched successfully",
      data: request,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteSellRequest = async (req, res) => {
  try {
    const result = await deleteSellRequestService(req.user, req.params.id);

    return res.status(result.statusCode).json(result);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateSellRequest = async (req, res) => {
  const result = await updateSellRequestService(
    req.user,
    req.params.id,
    req.body
  );

  return res.status(result.statusCode).json(result);
};

export const updateSellRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, reason } = req.body;
    const { id } = req.user;

    const updatedRequest = await updateSellRequestStatusService(
      requestId,
      status,
      reason
    );

    if (!updatedRequest) {
      return res
        .status(404)
        .json({ success: false, message: "Sell Request not found" });
    }

    const description =
      status == SELL_REQUEST_STATUS.APPROVED
        ? `Your Sell Request is ${status}`
        : updatedRequest.reason;

    await sendNotificationService({
      title: `Your Sell Request is ${status}`,
      description,
      senderId: id,
      receiverId: updatedRequest.userId,
      referenceType: NotificationType.SELL,
      referenceId: updatedRequest.id,
    });

    if (
      status === SELL_REQUEST_STATUS.APPROVED &&
      updatedRequest.isActive === true
    )
      await sendNotificationToMatchingBuyers(id, updatedRequest.id);

    return res.json({
      success: true,
      message: "Sell Request status updated successfully",
      data: updatedRequest,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
