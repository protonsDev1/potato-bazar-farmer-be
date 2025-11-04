import { Op } from "sequelize";
import AdvertisementService from "../database/models/adminModels/mobile/advertisementService";
import Advertisement from "../database/models/advertisement";
import User from "../database/models/user";

export const createAdvertisementRequest = async (req, res) => {
  try {
    const { serviceIds, description, serviceDuration } = req.body;
    const { id: userId } = req.user;

    if (Array.isArray(serviceIds)) {
      const isValidIds = await AdvertisementService.findAll({
        where: {
          id: { [Op.in]: serviceIds },
        },
        attributes: ["id"],
      });

      if (isValidIds.length !== serviceIds.length) {
        return res.status(400).json({
          success: false,
          message: "Please provide valid service ids.",
        });
      }

      for (const id of serviceIds) {
        await Advertisement.create({
          userId,
          serviceId: id,
          serviceDuration,
          description,
        });
      }
    }

    return res.status(201).json({
      success: true,
      message: "Advertisement Request created successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || "Failed in creating advertisement requests.",
    });
  }
};

export const getAllAdvertisementRequestByAdmin = async (req, res) => {
  try {
    let { page = 1, perPage: limit = 10, search, serviceId } = req.query;

    page = Number(page);
    limit = Number(limit);

    const offset = (page - 1) * limit;

    const whereCondition: any = {};
    const userWhereCondition: any = {};

    if (serviceId) whereCondition.serviceId = serviceId;

    if (search?.trim()) {
      const searchTerm = `%${search.trim()}%`;
      userWhereCondition[Op.or] = [
        { name: { [Op.iLike]: searchTerm } },
        { mobile: { [Op.iLike]: searchTerm } },
      ];
    }

    const { count, rows } = await Advertisement.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: User,
          as: "user",
          where: userWhereCondition,
        },
        {
          model: AdvertisementService,
          as: "advertisementServices",
        },
      ],
      limit,
      offset,
    });

    return res.status(200).json({
      success: true,
      message: "All Advertisement Requests fetched successfully.",
      data: {
        currentPage: page,
        total: count,
        totalPages: Math.ceil(count / limit),
        advertisements: rows,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error:
        error.message || "Failed in retrieving all advertisement requests.",
    });
  }
};

export const deleteAdvertisementRequest = async (req, res) => {
  try {
    const { id } = req.params;

    await Advertisement.destroy({ where: { id } });

    return res.status(200).json({
      success: true,
      message: "Advertisement Request deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || "Failed in deleting advertisement requests.",
    });
  }
};
