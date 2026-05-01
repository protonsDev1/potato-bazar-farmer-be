// services/liveAuctionService.ts
import { Op } from "sequelize";
import LiveAuction, {
  LIVE_AUCTION_STATUS,
} from "../database/models/liveAuction";
import { getPagination } from "../utils/commonCode";
import User from "../database/models/user";

const applyTimeFilter = (where: any, type: string) => {
  if (!type) return;

  const now = new Date();
  const currentDate = now.toISOString().split("T")[0];
  const currentTime = now.toTimeString().split(" ")[0];

  if (type === "upcoming") {
    where[Op.or] = [
      { auctionDate: { [Op.gt]: currentDate } },
      {
        auctionDate: currentDate,
        auctionTime: { [Op.gt]: currentTime },
      },
    ];
  }

  if (type === "completed") {
    where[Op.or] = [
      { auctionDate: { [Op.lt]: currentDate } },
      {
        auctionDate: currentDate,
        auctionTime: { [Op.lt]: currentTime },
      },
    ];
  }

  if (type === "live") {
    const liveWindowMinutes = 120;
    const pastTime = new Date(now.getTime() - liveWindowMinutes * 60000);

    const pastDate = pastTime.toISOString().split("T")[0];
    const pastTimeStr = pastTime.toTimeString().split(" ")[0];

    where[Op.and] = [
      {
        [Op.or]: [
          { auctionDate: { [Op.lt]: currentDate } },
          {
            auctionDate: currentDate,
            auctionTime: { [Op.lte]: currentTime },
          },
        ],
      },
      {
        [Op.or]: [
          { auctionDate: { [Op.gt]: pastDate } },
          {
            auctionDate: pastDate,
            auctionTime: { [Op.gte]: pastTimeStr },
          },
        ],
      },
    ];
  }
};

// 🔹 Create
export const createLiveAuctionService = async (payload) => {
  const { auctionDate, auctionTime } = payload;

  // Validate presence
  if (!auctionDate || !auctionTime) {
    return {
      error: "auctionDate and auctionTime are required",
      statusCode: 400,
    };
  }

  // Combine date + time
  const auctionDateTime = new Date(`${auctionDate}T${auctionTime}`);
  const now = new Date();

  // Invalid date check
  if (isNaN(auctionDateTime.getTime())) {
    return {
      error: "Invalid auction date or time format",
      statusCode: 400,
    };
  }

  // Future validation
  if (auctionDateTime <= now) {
    return {
      error: "Auction date and time must be in the future",
      statusCode: 400,
    };
  }

  const auction = await LiveAuction.create(payload);

  return auction;
};

// 🔹 My Auctions (pagination + search)
export const getMyLiveAuctionsService = async (userId, query) => {
  const { page, perPage, type, search, status, state, district } = query;

  const { limit, offset } = getPagination(page, perPage);

  const where: any = { userId };

  applyTimeFilter(where, type);

  // 🔹 Status filter
  if (status) {
    where.status = status;
  }

  // 🔹 Location filters
  if (state) where.state = state;
  if (district) where.district = district;

  if (search) {
    where[Op.or] = [
      { potatoType: { [Op.iLike]: `%${search}%` } },
      { potatoVariety: { [Op.iLike]: `%${search}%` } },
      { locationOrCity: { [Op.iLike]: `%${search}%` } },
    ];
  }

  const { rows, count } = await LiveAuction.findAndCountAll({
    where,
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });

  return {
    currentPage: Number(page) || 1,
    total: count,
    totalPages: Math.ceil(count / limit),
    data: rows,
  };
};

// 🔹 Public Auctions
export const getPublicLiveAuctionsService = async (query) => {
  const { page, perPage, type, search, state, district } = query;

  const { limit, offset } = getPagination(page, perPage);

  const where: any = {
    status: LIVE_AUCTION_STATUS.APPROVED,
  };

  applyTimeFilter(where, type);

  // 🔹 Location filters
  if (state) where.state = state;
  if (district) where.district = district;

  if (search) {
    where[Op.or] = [
      { potatoType: { [Op.iLike]: `%${search}%` } },
      { potatoVariety: { [Op.iLike]: `%${search}%` } },
      { locationOrCity: { [Op.iLike]: `%${search}%` } },
    ];
  }

  const { rows, count } = await LiveAuction.findAndCountAll({
    where,
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });

  return {
    currentPage: Number(page) || 1,
    total: count,
    totalPages: Math.ceil(count / limit),
    data: rows,
  };
};

export const getAllLiveAuctionsForAdminService = async ({
  page,
  perPage,
  status,
  search,
  state,
  district,
  type,
}) => {
  const offset = (page - 1) * perPage;

  const whereCondition: any = {};

  // 🔹 Status filter
  if (status) {
    whereCondition.status = status;
  }

  // 🔹 Location filters
  if (state) whereCondition.state = state;
  if (district) whereCondition.district = district;

  // 🔹 Search
  if (search && search.trim()) {
    const searchTerm = `%${search.trim()}%`;

    whereCondition[Op.or] = [
      { potatoType: { [Op.iLike]: searchTerm } },
      { potatoVariety: { [Op.iLike]: searchTerm } },
      { locationOrCity: { [Op.iLike]: searchTerm } },
      { contactPerson: { [Op.iLike]: searchTerm } },
    ];
  }

  // 🔹 Time-based filter (IMPORTANT)
  if (type) {
    const now = new Date();

    const currentDate = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const currentTime = now.toTimeString().split(" ")[0]; // HH:mm:ss

    if (type === "upcoming") {
      whereCondition[Op.or] = [
        { auctionDate: { [Op.gt]: currentDate } },
        {
          auctionDate: currentDate,
          auctionTime: { [Op.gt]: currentTime },
        },
      ];
    }

    if (type === "completed") {
      whereCondition[Op.or] = [
        { auctionDate: { [Op.lt]: currentDate } },
        {
          auctionDate: currentDate,
          auctionTime: { [Op.lt]: currentTime },
        },
      ];
    }

    if (type === "live") {
      // ⚠️ Since you don’t have duration, define "live window"
      const liveWindowMinutes = 120;

      const pastTime = new Date(now.getTime() - liveWindowMinutes * 60000);
      const pastDate = pastTime.toISOString().split("T")[0];
      const pastTimeStr = pastTime.toTimeString().split(" ")[0];

      whereCondition[Op.and] = [
        {
          [Op.or]: [
            { auctionDate: { [Op.lt]: currentDate } },
            {
              auctionDate: currentDate,
              auctionTime: { [Op.lte]: currentTime },
            },
          ],
        },
        {
          [Op.or]: [
            { auctionDate: { [Op.gt]: pastDate } },
            {
              auctionDate: pastDate,
              auctionTime: { [Op.gte]: pastTimeStr },
            },
          ],
        },
      ];
    }
  }

  const { rows, count } = await LiveAuction.findAndCountAll({
    where: whereCondition,
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name", "email", "mobile"],
      },
    ],
    order: [["createdAt", "DESC"]],
    limit: perPage,
    offset,
  });

  return {
    currentPage: page,
    total: count,
    totalPages: Math.ceil(count / perPage),
    auctions: rows,
  };
};

// 🔹 Get By ID
export const getLiveAuctionByIdService = async (id) => {
  return await LiveAuction.findByPk(id);
};

// 🔹 Update
export const updateLiveAuctionService = async (id, userId, payload) => {
  const auction = await LiveAuction.findOne({ where: { id, userId } });

  if (!auction) {
    return { error: "Auction not found", statusCode: 404 };
  }

  if (auction.userId !== userId) {
    return {
      error: "You are not authorized to update this auction",
      statusCode: 403,
    };
  }

  if (auction.status === LIVE_AUCTION_STATUS.APPROVED) {
    return {
      error: "Approved auctions cannot be updated",
      statusCode: 400,
    };
  }

  // Validate date + time if provided
  if (payload.auctionDate || payload.auctionTime) {
    if (!payload.auctionDate || !payload.auctionTime) {
      return {
        error: "Both auctionDate and auctionTime are required together",
        statusCode: 400,
      };
    }

    const auctionDateTime = new Date(
      `${payload.auctionDate}T${payload.auctionTime}`,
    );

    const now = new Date();

    if (isNaN(auctionDateTime.getTime())) {
      return {
        error: "Invalid auction date or time format",
        statusCode: 400,
      };
    }

    if (auctionDateTime <= now) {
      return {
        error: "Auction date and time must be in the future",
        statusCode: 400,
      };
    }
  }

  // Reset status if not pending
  if (auction.status !== LIVE_AUCTION_STATUS.PENDING) {
    payload.status = LIVE_AUCTION_STATUS.PENDING;
  }

  if (auction.status === LIVE_AUCTION_STATUS.REJECTED) {
    payload.status = LIVE_AUCTION_STATUS.PENDING;
  }

  await auction.update(payload);

  return { data: auction };
};

// 🔹 Delete
export const deleteLiveAuctionService = async (id, userId) => {
  const auction = await LiveAuction.findOne({ where: { id, userId } });

  if (!auction) {
    return { error: "Auction not found", statusCode: 404 };
  }

  if (auction.userId !== userId) {
    return {
      error: "You are not authorized to update this auction",
      statusCode: 403,
    };
  }

  await auction.destroy();

  return { success: true };
};

export const updateAuctionStatusService = async (id, payload) => {
  const auction = await LiveAuction.findByPk(id);

  if (!auction) {
    return { error: "Auction not found", statusCode: 404 };
  }

  // Only pending can be updated
  if (auction.status !== LIVE_AUCTION_STATUS.PENDING) {
    return {
      error: "Only pending auctions can be updated",
      statusCode: 400,
    };
  }

  if (payload.status === LIVE_AUCTION_STATUS.REJECTED) {
    auction.reason = payload.reason;
  }

  if (payload.status === LIVE_AUCTION_STATUS.APPROVED) {
    auction.verifiedAt = new Date();
  }

  auction.status = payload.status;

  await auction.save();

  return auction;
};

export const submitInspectionReportService = async (id, adminId, payload) => {
  const auction = await LiveAuction.findByPk(id);

  if (!auction) {
    return { error: "Auction not found", statusCode: 404 };
  }

  await auction.update({
    inspectionReport: payload.inspectionReport,
    defectivePercentage: payload.defectivePercentage,
    inspectionVideos: payload.inspectionVideos,
    inspectionImages: payload.inspectionImages,
    inspectionBy: adminId,
  });

  return auction;
};
