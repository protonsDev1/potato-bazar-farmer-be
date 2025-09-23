import { Op } from "sequelize";
import City from "../database/models/city";
import MandiList from "../database/models/mandiList";

export const addMandi = async (req, res) => {
  try {
    const { cityId, mandiName } = req.body;

    const isDuplicateMandi = await MandiList.findOne({
      where: { cityId, mandiName },
    });

    if (isDuplicateMandi)
      return res.status(400).json({
        success: false,
        message:
          "Another mandi with the same name already exists in this city.",
      });

    await MandiList.create({
      cityId,
      mandiName,
    });

    return res
      .status(201)
      .json({ success: true, message: "Mandi added successfully." });
  } catch (error) {
    console.error("Failed to add mandi:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add mandi",
      error: error.message,
    });
  }
};

export const retrieveAllMandisByCityArray = async (req, res) => {
  try {
    const { cityIds } = req.body;

    const mandiList = await MandiList.findAll({
      where: { cityId: { [Op.in]: cityIds } },
      include: [{ model: City, as: "city" }],
    });

    return res.status(200).json({
      success: true,
      message: "All Mandis retrieved by cityIds successfully.",
      data: mandiList,
    });
  } catch (error) {
    console.error("Failed to retrieve all mandis by array of cities:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve all mandis by array of cities.",
      error: error.message,
    });
  }
};

export const getAllMandiByCity = async (req, res) => {
  try {
    const { cityId } = req.params;

    const mandiList = await MandiList.findAll({
      where: { cityId },
      include: [
        {
          model: City,
          as: "city",
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "All Mandis retrieved by city successfully.",
      data: mandiList,
    });
  } catch (error) {
    console.error("Failed to retrieve all mandis by city:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve all mandis by city.",
      error: error.message,
    });
  }
};

export const getAllMandi = async (req, res) => {
  try {
    let { search, cityId, page = 1, perPage: limit = 10 } = req.query;

    page = Number(page);
    limit = Number(limit);

    const offset = (page - 1) * limit;

    const whereCondition: any = {};

    if (search) {
      whereCondition.mandiName = { [Op.iLike]: `%${search}%` };
    }

    if (cityId) {
      whereCondition.cityId = cityId;
    }

    const { count, rows } = await MandiList.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: City,
          as: "city",
        },
      ],
      limit,
      offset,
    });

    return res.status(200).json({
      success: true,
      message: "All Mandis retrieved successfully.",
      data: {
        mandiList: rows,
        currentPage: page,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("Failed to get all mandi:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get all mandi.",
      error: error.message,
    });
  }
};

export const updateMandi = async (req, res) => {
  try {
    const { id } = req.params;

    const { mandiName } = req.body;

    const isMandiExist = await MandiList.findByPk(id);

    if (!isMandiExist)
      return res.status(400).json({
        success: false,
        message: "Mandi with given id do not exists.",
      });

    const isDuplicateMandi = await MandiList.findOne({
      where: {
        cityId: isMandiExist.cityId,
        mandiName,
        id: { [Op.ne]: id },
      },
    });

    if (isDuplicateMandi) {
      return res.status(400).json({
        success: false,
        message:
          "Another mandi with the same name already exists in this city.",
      });
    }

    await MandiList.update({ mandiName }, { where: { id } });

    return res.status(200).json({
      success: true,
      message: "Mandi name updated successfully.",
    });
  } catch (error) {
    console.error("Failed to update mandi:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update mandi.",
      error: error.message,
    });
  }
};

export const deleteMandi = async (req, res) => {
  try {
    const { id } = req.params;

    const isMandiExist = await MandiList.findByPk(id);

    if (!isMandiExist)
      return res.status(400).json({
        success: false,
        message: "Mandi with given id do not exists.",
      });

    await MandiList.destroy({ where: { id } });

    return res.status(200).json({
      success: true,
      message: "Mandi deleted successfully.",
    });
  } catch (error) {
    console.error("Failed to delete mandi:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete mandi.",
      error: error.message,
    });
  }
};
