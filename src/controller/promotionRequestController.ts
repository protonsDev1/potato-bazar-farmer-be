import { Op } from "sequelize";
import PromotionRequest from "../database/models/promotionRequest";

export const createPromotionRequest = async (req, res) => {
  try {
    const request = await PromotionRequest.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Promotion request created successfully.",
      data: request,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getPromotionRequests = async (req, res) => {
  try {
    const page = parseInt(req.query.page || "1");
    const limit = parseInt(req.query.perPage || "10");
    const offset = (page - 1) * limit;
    const search = req.query.search || "";

    const whereCondition = {};

    if (search) {
      whereCondition[Op.or] = [
        { companyName: { [Op.iLike]: `%${search}%` } },
        { contactPerson: { [Op.iLike]: `%${search}%` } },
        { mobile: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows, count } = await PromotionRequest.findAndCountAll({
      where: whereCondition,
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    return res.status(200).json({
      success: true,
      total: count,
      page,
      perPage: limit,
      totalPages: Math.ceil(count / limit),
      data: rows,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getPromotionRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await PromotionRequest.findByPk(id);

    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Promotion request not found." });
    }

    return res.status(200).json({ success: true, data: request });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deletePromotionRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await PromotionRequest.findByPk(id);

    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Promotion request not found." });
    }

    await request.destroy();

    return res.status(200).json({
      success: true,
      message: "Promotion request deleted successfully.",
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
