import {
  getAgentDetailsById,
  getPaginatedAgents,
  resetAgentPassword,
  retrieveAgentDashboardStats,
  retrieveAgentPerformance,
  retrieveAllAgentPerformance,
  retrieveRecentRegistered,
  retrieveTopAgents,
  retriveAllUsers,
  softDeleteAgentById,
  updateAgentById,
} from "../services/agentService";

export const getAllRegisteredUsers = async (req, res) => {
  try {
    const { page, perPage: limit } = req.query;
    const { id, role } = req.user;

    if (role !== "agent")
      return res.status(400).json({
        message: "Only Agents are authorized to retrieve users under agent.",
      });

    const allUsers = await retriveAllUsers(id, page, limit);

    return res.status(200).json({ message: allUsers });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Failed in retreiving users." });
  }
};

export const getRecentRegisteredUsers = async (req, res) => {
  try {
    const { id, role } = req.user;

    if (role !== "agent")
      return res.status(400).json({
        message: "Only Agents are authorized to retrieve users under agent.",
      });

    const recentRegistered = await retrieveRecentRegistered(id);
    return res.status(200).json({ message: recentRegistered });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed in retreiving recent registrations.",
    });
  }
};

export const getAgentPerformance = async (req, res) => {
  try {
    const { role, id: agentId } = req.user;

    if (role !== "agent")
      return res.status(400).json({
        message: "Only Agents are authorized to retrieve agent's performance.",
      });

    const performance = await retrieveAgentPerformance(agentId);

    return res.status(200).json({ message: performance });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed in retreiving performance of agent.",
    });
  }
};

export const getAgentDashboardStats = async (req, res) => {
  try {
    const { role, id: agentId } = req.user;

    if (role !== "agent")
      return res.status(400).json({
        message:
          "Only Agents are authorized to retrieve agent's dashboard stats.",
      });

    const stats = await retrieveAgentDashboardStats(agentId);

    return res.status(200).json({ message: stats });
  } catch (error) {
    res.status(500).json({
      message:
        error.message || "Failed in retreiving dashboard stats of agent.",
    });
  }
};

export const listAgents = async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.perPage as string) || 10;

    const { agents, pagination } = await getPaginatedAgents(page, perPage);

    return res.status(200).json({
      message: "Agent list fetched successfully",
      pagination,
      agents,
    });
  } catch (error) {
    console.error("Error in list agents:", error);
    return res.status(500).json({
      message: error.message || "Failed to fetch agent list",
    });
  }
};

export const updateAgent = async (req, res) => {
  try {
    const result = await updateAgentById(req.params.id, req.body);

    if (!result.success) {
      return res
        .status(result.status)
        .json({ success: false, message: result.message });
    }

    return res.status(200).json({
      success: true,
      message: "Agent updated successfully",
      agent: result.data,
    });
  } catch (err: any) {
    console.error("Error updating agent:", err);
    return res.status(500).json({
      message: err.message || "Failed to update agent",
    });
  }
};

export const getAgentDetails = async (req, res) => {
  try {
    const result = await getAgentDetailsById(req.params.id);

    if (!result.success) {
      return res
        .status(result.status)
        .json({ success: false, message: result.message });
    }

    return res.status(200).json({
      success: true,
      message: "Agent details fetched successfully",
      agent: result.data,
    });
  } catch (err: any) {
    console.error("Error fetching agent details:", err);
    return res.status(500).json({
      message: err.message || "Agent not found",
    });
  }
};

export const deleteAgent = async (req, res) => {
  try {
    const result = await softDeleteAgentById(req.params.id);
    if (!result.success) {
      return res
        .status(result.status)
        .json({ success: false, message: result.message });
    }

    return res
      .status(200)
      .json({ success: true, message: "Agent deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Failed to delete agent",
    });
  }
};

export const resetPasswordForAgent = async (req, res) => {
  try {
    const result = await resetAgentPassword(req.params.id);

    if (!result.success) {
      return res.status(result.status).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
      credentials: {
        agentId: result.agentId,
        password: result.password,
      },
    });
  } catch (error) {
    console.error("Password reset failed:", error);
    return res.status(500).json({
      message: error.message || "Failed to reset password",
    });
  }
};

export const getAllAgentPerformance = async (req, res) => {
  try {
    const result = await retrieveAllAgentPerformance();

    return res
      .status(200)
      .json({ message: "All agent performance:", data: result });
  } catch (error) {
    console.error("Failed in retrieving all agent performance", error);
    return res.status(500).json({
      message: error.message || "Failed in retrieving all agent performance",
    });
  }
};

export const getTopAgents = async (req, res) => {
  try {
    const result = await retrieveTopAgents();

    return res.status(200).json({ message: "All top agents:", data: result });
  } catch (error) {
    console.error("Failed in retrieving all top agents", error);
    return res.status(500).json({
      message: error.message || "Failed in retrieving all top agents",
    });
  }
};
