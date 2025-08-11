import {
  createRequirementAndInterests,
  getMyRequirementsService,
} from "../services/csRequirementService";

export const getMyRequirements = async (req, res) => {
  try {
    const { page = 1, perPage = 10 } = req.query; // default values
    const userId = req.user.id;

    const result = await getMyRequirementsService(
      userId,
      Number(page),
      Number(perPage)
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

    const result = await createRequirementAndInterests(requirementData);

    return res.status(201).json({
      success: true,
      message: "Requirement and interest requests created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Controller Error:", error);
    res.status(500).json({
      message: error.message || "Failed to create cold storage requirement",
    });
  }
};
