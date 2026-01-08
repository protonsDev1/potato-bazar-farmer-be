import { Op } from "sequelize";
import {
  createRecord,
  getAllRecords,
  updateRecord,
  deleteRecord,
  getActiveRecords,
} from "../../../services/adminServices/crudOperationService";
import DirectoryCategory from "../../../database/models/directoryCategory";
import DirectorySubCategory from "../../../database/models/directorySubCategory";
import { generateTranslationsForRecord } from "../../../utils/translation";

export const addDirectorySubCategory = async (req, res) => {
  try {
    const data = req.body;

    const response = await createRecord(DirectorySubCategory, data);

    if (response?.duplicate) {
      return res.status(409).json({
        message: "Directory Sub Category with this name already exists.",
      });
    }

    if (response?.success) {
      return res.status(201).json({
        message: "New Directory Sub Category added successfully.",
        data: response.data,
      });
    }

    try {
      await generateTranslationsForRecord(response.data, {
        recordId: response.data.id,
        recordType: "DirectorySubCategory",
        fields: ["name"],
      });
    } catch (err: any) {
      console.error(
        `[Directory Sub Category ${response.data.id}] Translation error:`,
        err?.message || err
      );
    }

    return res
      .status(400)
      .json({ message: "Failed to add Directory Sub Category." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to add Directory Sub Category.",
    });
  }
};

export const getDirectorySubCategory = async (req, res) => {
  try {
    const { categoryId } = req.query;

    const whereCondition = categoryId
      ? { categoryId, isDeleted: false }
      : { isDeleted: false };

    const response = await DirectorySubCategory.findAll({
      where: whereCondition,
      include: [
        {
          model: DirectoryCategory,
          as: "category",
        },
      ],
      order: [["position", "ASC"]],
    });

    if (response) {
      return res.status(200).json({
        message: "Potato Sub Categories fetched successfully.",
        data: response,
      });
    }

    return res
      .status(404)
      .json({ message: "No Directory Sub Category found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve Directory Sub Category.",
    });
  }
};

export const getActiveDirectorySubCategory = async (req, res) => {
  try {
    const { categoryId } = req.query;

    const whereCondition = categoryId
      ? { categoryId, isActive: true, isDeleted: false }
      : { isActive: true, isDeleted: false };

    const response = await DirectorySubCategory.findAll({
      where: whereCondition,
      include: [
        {
          model: DirectoryCategory,
          as: "category",
        },
      ],
      order: [["position", "ASC"]],
    });

    if (response) {
      return res.status(200).json({
        message: "Potato Sub Categories fetched successfully.",
        data: response,
      });
    }

    return res
      .status(404)
      .json({ message: "No Directory Sub Category found." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve Directory Sub Category.",
    });
  }
};

export const updateDirectorySubCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    const subCategory = await DirectorySubCategory.findByPk(id);
    if (!subCategory) {
      return res.status(404).json({
        message: "Directory Sub Category not found.",
      });
    }

    if (data.name) {
      const duplicate = await DirectorySubCategory.findOne({
        where: {
          name: data.name,
          id: { [Op.ne]: id },
        },
      });
      if (duplicate) {
        return res.status(409).json({
          message: "Directory Sub Category with this name already exists.",
        });
      }
    }

    // const oldName = subCategory.name;

    const updatedRecord = await subCategory.update(data);

    // if (data.name && data.name !== oldName) {
    //   const category = await DirectoryCategory.findByPk(
    //     subCategory.varietyId
    //   );

    //   if (category) {
    //     await PotatoVarietyGrown.update(
    //       { subCategory: data.name },
    //       {
    //         where: {
    //           variety: category.name,
    //           subCategory: oldName,
    //         },
    //       }
    //     );
    //   }
    // }

    try {
      await generateTranslationsForRecord(updatedRecord, {
        recordId: updatedRecord.id,
        recordType: "DirectorySubCategory",
        fields: ["name"],
      });
    } catch (err: any) {
      console.error(
        `[Directory Sub Category ${updatedRecord.id}] Translation error:`,
        err?.message || err
      );
    }

    return res.status(200).json({
      message: "Directory Sub Category updated successfully.",
      data: updatedRecord,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to update Directory Sub Category.",
    });
  }
};

export const deleteDirectorySubCategory = async (req, res) => {
  try {
    const id = req.params.id;

    const response = await deleteRecord(DirectorySubCategory, id);

    if (!response || response.success === false) {
      return res.status(404).json({
        message: response?.error || "Directory Sub Category not found.",
      });
    }

    return res.status(200).json({
      message: "Directory Sub Category deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to delete Directory Sub Category.",
    });
  }
};
