import ColdStorage from "../database/models/coldStorage";
import Farmer from "../database/models/farmer";
import { formatDate } from "../utils/dateFormat";

export const retriveAllUsers = async (
  agentId: string,
  page = 1,
  limit = 10
) => {
  try {
    const offset = (page - 1) * limit;

   const [farmers, coldStorages] = await Promise.all([
      Farmer.findAll({
        where: { onBoardedBy: agentId },
        order: [["createdAt", "DESC"]],
      }),
      ColdStorage.findAll({
        where: { onBoardedBy: agentId },
        order: [["createdAt", "DESC"]],
      }),
    ]);

    // Combine both
    const combined = [...farmers, ...coldStorages].map((item: any) => ({
      id: item.id,
      name: item.name,
      village: item.village,
      district: item.district,
      createdAt: item.createdAt,
      date: formatDate(item.createdAt),
      type: item instanceof Farmer ? "farmer" : "cold storage",
      status: "complete",
    }));

    // Sort by date descending
    combined.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const paginated = combined.slice(offset, offset + limit);

    const result = paginated.map(({ createdAt, ...rest }) => rest);

    return {
      data: result,
      total: combined.length,
      currentPage: page,
      totalPages: Math.ceil(combined.length / limit),
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const retrieveRecentRegistered = async (agentId) => {
  try {
    const [farmers, coldStorages] = await Promise.all([
      Farmer.findAll({
        where: { onBoardedBy: agentId },
        order: [["createdAt", "DESC"]],
      }),
      ColdStorage.findAll({
        where: { onBoardedBy: agentId },
        order: [["createdAt", "DESC"]],
      }),
    ]);

    const combined = [...farmers, ...coldStorages].map((item: any) => ({
      id: item.id,
      name: item.name,
      village: item.village,
      district: item.district,
      date: formatDate(item.createdAt),
      createdAt: item.createdAt,
      type: item instanceof Farmer ? "farmer" : "cold storage",
      status: "complete",
    }));

    combined.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Take top 5
    const topFive = combined.slice(0, 5);

    const result = topFive.map(({ createdAt, ...rest }) => rest);

    return { data: result };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
