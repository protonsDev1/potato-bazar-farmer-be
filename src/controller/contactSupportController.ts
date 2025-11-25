import { Op } from "sequelize";

import ContactSupport, {
  CONTACT_SUPPORT_STATUS,
} from "../database/models/contactSupport";
import User from "../database/models/user";

export const createContactSupport = async (req, res) => {
  try {
    const { fullName, mobileNumber, preferredDate, preferredTime } = req.body;

    await ContactSupport.create({
      userId: req.user ? req.user.id : null,
      fullName,
      mobileNumber,
      preferredDate,
      preferredTime,
    });

    return res.status(201).json({
      success: true,
      message: "Contact Support created successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || "Failed in creating Contact Support.",
    });
  }
};

export const getContactSupportList = async (req, res) => {
  try {
    let { page = 1, perPage: limit = 10, search, status } = req.query;

    page = Number(page);
    limit = Number(limit);

    const offset = (page - 1) * limit;

    const whereCondition: any = {};

    if (status) whereCondition.status = status;

    if (search?.trim()) {
      const searchTerm = `%${search.trim()}%`;
      whereCondition[Op.or] = [
        {
          mobileNumber: { [Op.iLike]: searchTerm },
        },
        {
          fullName: { [Op.iLike]: searchTerm },
        },
      ];
    }

    const { count, rows } = await ContactSupport.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: User,
          as: "user",
          attributes: { exclude: ["password_hash", "playerId"] },
        },
      ],
      limit,
      offset,
      order: [["updatedAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Contact support list fetched successfully.",
      data: {
        currentPage: page,
        total: count,
        totalPages: Math.ceil(count / limit),
        contactSupportList: rows,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || "Failed in retrieving contact support list.",
    });
  }
};

export const deleteContactSupport = async (req, res) => {
  try {
    const { id } = req.params;

    await ContactSupport.destroy({ where: { id } });

    return res.status(200).json({
      success: true,
      message: "Contact Support deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || "Failed in deleting Contact Support.",
    });
  }
};

export const updateContactSupportStatus = async (req, res) => {
  try {
    const { id } = req.params;

    await ContactSupport.update(
      { status: CONTACT_SUPPORT_STATUS.CLOSE },
      { where: { id } }
    );

    return res.status(200).json({
      success: true,
      message: "Contact Support Request status updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error:
        error.message || "Failed in updating contact support request's status.",
    });
  }
};
