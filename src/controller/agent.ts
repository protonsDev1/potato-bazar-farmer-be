import {
  retrieveAgentDashboardStats,
  retrieveAgentPerformance,
  retrieveRecentRegistered,
  retriveAllUsers,
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
