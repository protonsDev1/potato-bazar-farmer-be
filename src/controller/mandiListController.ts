import { Op } from "sequelize";
import City from "../database/models/city";
import MandiList from "../database/models/mandiList";
import State from "../database/models/state";
import { hasValue } from "../utils/parseQuery";
import MandiPrice from "../database/models/mandiPrice";

export const addMandi = async (req, res) => {
  try {
    const { cityId, mandiName, address, isTopMandi, position } = req.body;

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
      address,
      isTopMandi,
      position,
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

    const today = new Date();
    today.setHours(23, 59, 59, 999); // include entire today

    const mandiList = await MandiList.findAll({
      where: { cityId },
      include: [
        {
          model: City,
          as: "city",
        },
        {
          model: MandiPrice,
          as: "mandiPrices",
          attributes: ["date"],
          required: true,
          where: {
            date: {
              [Op.lte]: today,
            },
          },
          order: [["date", "DESC"]],
          limit: 1,
        },
      ],
      order: [["updatedAt", "DESC"]],
      subQuery: false,
    });

    const filteredList = mandiList
      .filter((mandi) => mandi.mandiPrices && Array.isArray(mandi.mandiPrices) && mandi.mandiPrices.length > 0)
      .map((mandi) => ({
        ...mandi.toJSON(),
        mandiPrices: [mandi.mandiPrices[0]],
      }));

    return res.status(200).json({
      success: true,
      message: "All Mandis retrieved by city successfully.",
      data: filteredList,
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
    let { search, cityId, stateId, page = 1, perPage: limit = 10 } = req.query;

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
          include: [
            {
              model: State,
              as: "state",
              required: true,
              ...(stateId && { where: { id: stateId } }),
            },
          ],
          required: true,
        },
      ],
      limit,
      offset,
      order: [["updatedAt", "DESC"]],
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

    const { mandiName, address, isTopMandi, position } = req.body;

    const isMandiExist = await MandiList.findByPk(id);

    if (!isMandiExist)
      return res.status(400).json({
        success: false,
        message: "Mandi with given id do not exists.",
      });

    if (mandiName) {
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
    }

    const updateFields: any = {};
    if (hasValue(mandiName)) updateFields.mandiName = mandiName;
    if (address !== undefined) updateFields.address = address;
    if (hasValue(isTopMandi)) updateFields.isTopMandi = isTopMandi;
    if (hasValue(position)) updateFields.position = position;

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields provided to update.",
      });
    }

    await MandiList.update(updateFields, { where: { id } });

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
