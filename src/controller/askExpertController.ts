import AskExpert, { QUERY_STATUS } from "../database/models/askExpert";
import User from "../database/models/user";

export const askQuery = async (req, res) => {
  try {
    const { query } = req.body;
    const { id: userId } = req.user;

    const userQuery = await AskExpert.create({
      userId,
      query,
    });

    return res.status(201).json({
      success: true,
      data: userQuery,
    });
  } catch (error) {
    console.error("Error in making a query:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllQueries = async (req, res) => {
  try {
    let { page = 1, perPage: limit = 10, status } = req.query;

    page = Number(page);
    limit = Number(limit);

    const offset = (page - 1) * limit;

    const whereCondition: any = {};

    if (status) whereCondition.status = status;

    const { rows, count } = await AskExpert.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: User,
          as: "user",
        },
      ],
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: "All queries fetched successfully.",
      data: {
        queries: rows,
        currentPage: page,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("Error in retrieving all queries:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const respondToQuery = async (req, res) => {
  try {
    const { response } = req.body;
    const { queryId } = req.params;

    const isValidQueryId = await AskExpert.findOne({ where: { id: queryId } });

    if (!isValidQueryId)
      return res
        .status(400)
        .json({ success: false, message: "Please provide a valid query id." });

    await AskExpert.update(
      { response, status: QUERY_STATUS.CLOSE },
      { where: { id: queryId } }
    );

    return res
      .status(200)
      .json({ success: true, message: "Query responded successfully." });
  } catch (error) {
    console.error("Error in responding to query:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllMyQueries = async (req, res) => {
  try {
    const { id: userId } = req.user;
    let { page = 1, perPage: limit = 10 } = req.query;

    page = Number(page);
    limit = Number(limit);

    const offset = (page - 1) * limit;

    const { rows, count } = await AskExpert.findAndCountAll({
      where: {
        userId,
      },

      include: [
        {
          model: User,
          as: "user",
        },
      ],
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: "All queries fetched successfully.",
      data: {
        queries: rows,
        currentPage: page,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("Error in retrieving all queries:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
