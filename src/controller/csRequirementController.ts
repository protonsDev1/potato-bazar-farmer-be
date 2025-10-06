import { USER_ROLES } from "../database/models/user";
import {
  createRequirementAndInterests,
  deleteRequirementService,
  getRequirementByIdService,
  getRequirementsService,
  likeOrDislikeRequirementService,
  updateRequirementService,
} from "../services/csRequirementService";

export const getRequirements = async (req, res) => {
  try {
    const {
      page = 1,
      perPage = 10,
      listingType,
      commodityType,
      verified,
      district,
      pbVerified,
    } = req.query;
    const userId = req.user.id;

    const result = await getRequirementsService(
      userId,
      Number(page),
      Number(perPage),
      listingType,
      { commodityType, verified, district, pbVerified }
    );

    return res.status(200).json({
      success: true,
      message: "My requirements fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("Controller Error:", error);
    res.status(500).json({
      message: error.message || "Failed to fetch requirements",
    });
  }
};

export const createRequirementWithInterests = async (req, res) => {
  try {
    const requirementData = {
      ...req.body,
      createdBy: req.user.id,
    };

    if (req.user.role !== USER_ROLES.USER) {
      return res.status(403).json({
        success: false,
        message: "Only Users are allowed to create cold storage requirements",
      });
    }

    const result = await createRequirementAndInterests(requirementData);

    return res.status(201).json({
      success: true,
      message: "Cold storage requirement created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Controller Error:", error);
    res.status(500).json({
      message: error.message || "Failed to create cold storage requirement",
    });
  }
};

export const getRequirementById = async (req, res) => {
  try {
    const result = await getRequirementByIdService(req.params.id, req.user.id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Requirement not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Requirement fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("Get Requirement By Id Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch requirement",
    });
  }
};

export const updateRequirement = async (req, res) => {
  try {
    const result = await updateRequirementService(
      req.params.id,
      req.user.id,
      req.body
    );

    if (!result.success) {
      return res.status(result.statusCode).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Update Requirement Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update requirement",
    });
  }
};

export const deleteRequirement = async (req, res) => {
  try {
    const result = await deleteRequirementService(req.params.id, req.user.id);

    return res.status(result.statusCode).json(result);
  } catch (error) {
    console.error("Delete Requirement Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete requirement",
    });
  }
};

export const likeOrDislikeCSRequirement = async (req, res) => {
  try {
    const { id } = req.user;
    const { requirementId } = req.params;

    const response = await likeOrDislikeRequirementService(id, requirementId);

    if (!response.success)
      return res.status(400).json({ message: response.error });

    return res.status(200).json({ message: response.data });
  } catch (error) {
    console.error("Like or dislike Cold Storage Requirement error:", error);
    res.status(500).json({
      message: "Failed to like or dislike cold storage requirement",
      error: error.message,
    });
  }
};
