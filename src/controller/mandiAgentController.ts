import {
  addMandiAgent,
  deleteMandiAgentService,
  getAllMandiAgents,
  getProfileOverview,
  updateMandiAgentService,
} from "../services/mandiAgentService";

export const createMandiAgent = async (req, res) => {
  try {
    const response = await addMandiAgent(req.body);

    if (!response.success)
      return res.status(400).json({ message: response.error });
    return res.status(201).json({
      message: "Mandi Agent created successfully.",
      data: response.data,
    });
  } catch (error) {
    console.error("Failed to create mandi agent:", error);
    return res.status(500).json({
      message: "Failed to create mandi agent",
      error: error.message,
    });
  }
};

export const retrieveMandiAgents = async (req, res) => {
  try {
    const { search, page, perPage: limit } = req.query;

    const response = await getAllMandiAgents(search, page, limit);

    return res.status(200).json({
      message: "All Mandi Agents retrieved successfully.",
      paginatedData: response,
    });
  } catch (error) {
    console.error("Failed to retrieve mandi agents:", error);
    return res.status(500).json({
      message: "Failed to retrieve mandi agents",
      error: error.message,
    });
  }
};

export const retrieveMandiAgentProfile = async (req, res) => {
  try {
    const { mandiAgentId } = req.params;

    const response = await getProfileOverview(mandiAgentId);

    return res.status(200).json({
      message: "Mandi Agent Profile retrived successfull.",
      data: response.mandiUser,
    });
  } catch (error) {
    console.error("Failed to retrieve mandi agent profile:", error);
    return res.status(500).json({
      message: "Failed to retrieve mandi agent profile",
      error: error.message,
    });
  }
};

export const updateMandiAgent = async (req, res) => {
  try {
    const { mandiAgentId } = req.params;

    const updatedMandiAgent = await updateMandiAgentService(
      mandiAgentId,
      req.body
    );

    if (!updatedMandiAgent.success)
      return res.status(400).json({ message: updatedMandiAgent.error });

    return res.status(200).json({
      message: updatedMandiAgent.message,
      updatedData: updatedMandiAgent.data,
    });
  } catch (error) {
    console.error("Failed to update mandi agent:", error);
    return res.status(500).json({
      message: "Failed to update mandi agent",
      error: error.message,
    });
  }
};

export const deleteMandiAgent = async (req, res) => {
  try {
    const { mandiAgentId } = req.params;

    const response = await deleteMandiAgentService(mandiAgentId);

    if (!response.success)
      return res.status(400).json({ message: response.error });

    return res.status(200).json({ message: response.message });
  } catch (error) {
    console.error("Failed to delete mandi agent:", error);
    return res.status(500).json({
      message: "Failed to delete mandi agent",
      error: error.message,
    });
  }
};
