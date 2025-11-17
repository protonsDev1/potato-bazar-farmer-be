import { Op } from "sequelize";

import Faq from "../database/models/faq";
import FaqCategory from "../database/models/adminModels/mobile/faqCategory";

export const createFaq = async (req, res) => {
  try {
    const { categoryId, question, answer } = req.body;

    await Faq.create({
      categoryId,
      question,
      answer,
    });

    return res.status(201).json({
      success: true,
      message: "Faq created successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || "Failed in creating Faq.",
    });
  }
};

export const getAllFaqs = async (req, res) => {
  try {
    let { page = 1, perPage: limit = 10, search, categoryId } = req.query;

    page = Number(page);
    limit = Number(limit);

    const offset = (page - 1) * limit;

    const whereCondition: any = {};

    if (categoryId) whereCondition.categoryId = categoryId;

    if (search?.trim()) {
      const searchTerm = `%${search.trim()}%`;
      whereCondition[Op.or] = [
        { question: { [Op.iLike]: searchTerm } },
        { answer: { [Op.iLike]: searchTerm } },
      ];
    }

    const { count, rows } = await Faq.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: FaqCategory,
          as: "categories",
        },
      ],
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: "All Faqs fetched successfully.",
      data: {
        currentPage: page,
        total: count,
        totalPages: Math.ceil(count / limit),
        faqs: rows,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || "Failed in retrieving all faqs.",
    });
  }
};

export const updateFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer, categoryId } = req.body;

    const [count, [updatedFaq]] = await Faq.update(
      { question, answer, categoryId },
      { where: { id }, returning: true }
    );

    if (count === 0) {
      return res.status(404).json({
        success: false,
        message: "Faq not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Faq updated successfully.",
      data: updatedFaq,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || "Failed in updating Faq.",
    });
  }
};

export const deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;

    await Faq.destroy({ where: { id } });

    return res.status(200).json({
      success: true,
      message: "Faq deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || "Failed in deleting Faq.",
    });
  }
};
