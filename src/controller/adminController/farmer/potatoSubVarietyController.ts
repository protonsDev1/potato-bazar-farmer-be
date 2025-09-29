import { Op } from "sequelize";
import AdminPotatoSubVarietyGrown from "../../../database/models/adminModels/farmer/adminPotatoSubVariety";
import AdminPotatoVarietyGrown from "../../../database/models/adminModels/farmer/adminPotatoVarietyGrown";
import {
  createRecord,
  getAllRecords,
  updateRecord,
  deleteRecord,
  getActiveRecords,
} from "../../../services/adminServices/crudOperationService";
import PotatoVarietyGrown from "../../../database/models/potatoVarietyGrown";

export const addPotatoSubVarietyGrown = async (req, res) => {
  try {
    const data = req.body;

    const response = await createRecord(AdminPotatoSubVarietyGrown, data);

    if (response?.duplicate) {
      return res.status(409).json({
        message: "Potato Sub Variety with this name already exists.",
      });
    }

    if (response?.success) {
      return res.status(201).json({
        message: "New Potato Sub Variety added successfully.",
        data: response.data,
      });
    }

    return res
      .status(400)
      .json({ message: "Failed to add Potato Sub Variety." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to add Potato Sub Variety.",
    });
  }
};

export const getPotatoSubVarietyGrown = async (req, res) => {
  try {
    const { varietyId } = req.query;

    const whereCondition = varietyId ? { varietyId } : {};

    const response = await AdminPotatoSubVarietyGrown.findAll({
      where: whereCondition,
      include: [
        {
          model: AdminPotatoVarietyGrown,
          as: "parentVariety",
        },
      ],
      order: [["position", "ASC"]],
    });

    if (response) {
      return res.status(200).json({
        message: "Potato Sub Varieties fetched successfully.",
        data: response,
      });
    }

    return res.status(404).json({ message: "No Potato Sub Variety found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve Potato Sub Variety.",
    });
  }
};

export const getActivePotatoSubVarietyGrown = async (req, res) => {
  try {
    const { varietyId } = req.query;

    const whereCondition = varietyId
      ? { varietyId, isActive: true }
      : { isActive: true };

    const response = await AdminPotatoSubVarietyGrown.findAll({
      where: whereCondition,
      include: [
        {
          model: AdminPotatoVarietyGrown,
          as: "parentVariety",
        },
      ],
      order: [["position", "ASC"]],
    });

    if (response) {
      return res.status(200).json({
        message: "Potato Sub Varieties fetched successfully.",
        data: response,
      });
    }

    return res.status(404).json({ message: "No Potato Sub Variety found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve Potato Sub Variety.",
    });
  }
};

export const updatePotatoSubVariety = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    const subVariety = await AdminPotatoSubVarietyGrown.findByPk(id);
    if (!subVariety) {
      return res.status(404).json({
        message: "Potato Sub Variety not found.",
      });
    }

    if (data.name) {
      const duplicate = await AdminPotatoSubVarietyGrown.findOne({
        where: {
          name: data.name,
          id: { [Op.ne]: id },
        },
      });
      if (duplicate) {
        return res.status(409).json({
          message: "Potato Sub Variety with this name already exists.",
        });
      }
    }

    const oldName = subVariety.name;

    await subVariety.update(data);

    if (data.name && data.name !== oldName) {
      const parentVariety = await AdminPotatoVarietyGrown.findByPk(
        subVariety.varietyId
      );

      if (parentVariety) {
        await PotatoVarietyGrown.update(
          { subVariety: data.name },
          {
            where: {
              variety: parentVariety.name,
              subVariety: oldName,
            },
          }
        );
      }
    }

    return res.status(200).json({
      message: "Potato Sub Variety updated successfully.",
      data: subVariety,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to update Potato Sub Variety.",
    });
  }
};

export const deletePotatoSubVariety = async (req, res) => {
  try {
    const id = req.params.id;

    const response = await deleteRecord(AdminPotatoSubVarietyGrown, id);

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Potato Sub Variety not found.",
      });
    }

    return res.status(200).json({
      message: "Potato Sub Variety deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to delete Potato Sub Variety.",
    });
  }
};
