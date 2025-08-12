import ExcelJS from "exceljs";

import { StatusEnum } from "../database/models/helpAndSupport";
import {
  changeTicketStatus,
  createTicket,
  getAgentDetailsById,
  getPaginatedAgents,
  resetAgentPassword,
  responseOnTicket,
  retrieveAgentDashboardStats,
  retrieveAgentPerformance,
  retrieveAgentTickets,
  retrieveAllAgentPerformance,
  retrieveAllTicketDetails,
  retrieveRecentRegistered,
  retrieveTicketDetail,
  retrieveTopAgents,
  retrieveAllUsers,
  softDeleteAgentById,
  updateAgentById,
  getAllAgentsWithAssociations,
  createAgentWorksheetColumns,
  addAgentsToWorksheet,
} from "../services/agentService";
import { parseFilters } from "../utils/parseQuery";

export const getAllRegisteredUsers = async (req, res) => {
  try {
    const { page, perPage: limit } = req.query;
    const { id, role } = req.user;

    const filters = parseFilters(req.query);

    if (role !== "agent")
      return res.status(400).json({
        message: "Only Agents are authorized to retrieve users under them.",
      });

    const allUsers = await retrieveAllUsers(id, page, limit, filters);

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
    const { page, perPage: limit } = req.query;

    if (role !== "agent")
      return res.status(400).json({
        message:
          "Only Agents are authorized to retrieve recent registered users under them.",
      });

    const recentRegistered = await retrieveRecentRegistered(id, page, limit);
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
    const { year } = req.query;

    if (role !== "agent")
      return res.status(400).json({
        message:
          "Only Agents are authorized to retrieve their own performance.",
      });

    const performance = await retrieveAgentPerformance(agentId, year);

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
          "Only Agents are authorized to retrieve their own dashboard stats.",
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
    const search = req.query.search;

    const { agents, pagination } = await getPaginatedAgents(
      page,
      perPage,
      search
    );

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
    const { year } = req.query;

    const result = await retrieveAllAgentPerformance(year);

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

export const createSupportTicket = async (req, res) => {
  try {
    const data = req.body;
    const { id: agentId, role } = req.user;

    if (role !== "agent")
      return res.status(400).json({
        message: "Only Agents are authorized to create support ticket.",
      });

    const response = await createTicket(data, agentId);

    if (!response.success)
      return res.status(400).json({ message: response.error });

    return res
      .status(201)
      .json({ message: "New support ticket created", ticket: response.data });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed in creating support ticket.",
    });
  }
};

export const replyToSupportTicket = async (req, res) => {
  try {
    const { reply } = req.body;
    const ticketId = req.params.ticketId;
    const response = await responseOnTicket(ticketId, reply);

    if (!response.success)
      return res.status(400).json({ message: response.error });

    return res
      .status(200)
      .json({ message: "Responded to support ticket successfully.", reply });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed in responding to support ticket.",
    });
  }
};

export const getTicketDetail = async (req, res) => {
  try {
    const ticketId = req.params.ticketId;
    const { id: agentId } = req.user;

    const response = await retrieveTicketDetail(ticketId, agentId);

    return res.status(200).json({
      message: "Ticket detail fetched successfully.",
      detail: response,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed in retrieving support ticket detail.",
    });
  }
};

export const getAllTicketDetails = async (req, res) => {
  try {
    const { page, perPage: limit, search } = req.query;

    const allTicketDetails = await retrieveAllTicketDetails(
      page,
      limit,
      search
    );

    return res.status(200).json({
      message: "All support ticket details fetched successfully.",
      allTicketDetails,
    });
  } catch (error) {
    return res.status(500).json({
      message:
        error.message || "Failed in retrieving  all support ticket details.",
    });
  }
};

export const updateStatusOfTicket = async (req, res) => {
  try {
    const ticketId = req.params.ticketId;
    const { status } = req.body;
    const { role } = req.user;

    if (role === "agent" && status !== StatusEnum.OPEN)
      return res.status(401).json({
        message: `Agents are only allowed to set status to '${StatusEnum.OPEN}'.`,
      });

    const response = await changeTicketStatus(ticketId, status);

    if (!response.success)
      return res.status(400).json({ message: response.error });

    return res
      .status(200)
      .json({ message: "Ticket status updated successfully." });
  } catch (error) {
    return res.status(500).json({
      message:
        error.message || "Failed in retrieving  all support ticket details.",
    });
  }
};

export const getAgentAllTickets = async (req, res) => {
  try {
    const { page, perPage: limit, search } = req.query;
    const { id: agentId } = req.user;
    const tickets = await retrieveAgentTickets(agentId, page, limit, search);

    return res
      .status(200)
      .json({ message: "Agent's all tickets fetched successfully", tickets });
  } catch (error) {
    return res.status(500).json({
      message:
        error.message || "Failed in retrieving agent's all support tickets.",
    });
  }
};

export const exportAgents = async (req, res) => {
  try {
    const { search } = req.query;

    const agents = await getAllAgentsWithAssociations(search as string);

    if (!agents.length) {
      return res.status(404).json({ message: "No agents found." });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Agents");

    createAgentWorksheetColumns(worksheet);
    addAgentsToWorksheet(agents, worksheet);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=agents.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Failed to export agents", error);
    res.status(500).json({ message: "Failed to export agents", error });
  }
};
