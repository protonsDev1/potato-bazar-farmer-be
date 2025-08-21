import {
  createSellRequestService,
  deleteSellRequestService,
  getSellRequestByIdService,
  listAdminSellRequestsService,
  listSellRequestsService,
  listMySellRequestsService,
  updateSellRequestService,
} from "../services/sellRequestService";

export const createSellRequest = async (req, res) => {
  try {
    const sellRequest = await createSellRequestService(req.user.id, req.body);

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
    const requests = await listSellRequestsService(req.query);
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
    const request = await getSellRequestByIdService(req.params.id);

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
    const deleted = await deleteSellRequestService(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Sell request not found",
      });
    }

    return res.json({
      success: true,
      message: "Sell request deleted successfully",
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateSellRequest = async (req, res) => {
  const result = await updateSellRequestService(
    req.user.id,
    req.params.id,
    req.body
  );

  return res.status(result.statusCode).json(result);
};
