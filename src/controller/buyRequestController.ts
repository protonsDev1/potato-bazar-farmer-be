import {
  createBuyRequestService,
  deleteBuyRequestService,
  getBuyRequestByIdService,
  listAdminBuyRequestsService,
  listBuyRequestsService,
  listMyBuyRequestsService,
  updateBuyRequestService,
} from "../services/buyRequestService";

export const createBuyRequest = async (req, res) => {
  try {
    const buyRequest = await createBuyRequestService(req.user.id, req.body);

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
    const request = await getBuyRequestByIdService(req.params.id);

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
    const deleted = await deleteBuyRequestService(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Buy request not found",
      });
    }

    return res.json({
      success: true,
      message: "Buy request deleted successfully",
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateBuyRequest = async (req, res) => {
  const result = await updateBuyRequestService(
    req.user.id,
    req.params.id,
    req.body
  );

  return res.status(result.statusCode).json(result);
};
