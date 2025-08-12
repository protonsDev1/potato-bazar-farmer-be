import AgentOnboardedUser, {
  USER_TYPE,
} from "../database/models/agentOnboardedUsers";
import ColdStorage from "../database/models/coldStorage";
import Farmer from "../database/models/farmer";
import Trader from "../database/models/trader/trader";
import { REGISTRATION_STATUS } from "../database/models/user";

const backfillAgentOnboardedUsers = async () => {
  try {
    const count = await AgentOnboardedUser.count();

    if (count !== 0) {
      await AgentOnboardedUser.destroy({
        where: {},
        truncate: true,
        restartIdentity: true,
      });
    }

    const farmers = await Farmer.findAll({
      attributes: [
        "userId",
        "onBoardedBy",
        "name",
        "village",
        "district",
        "state",
      ],
    });
    const coldstorages = await ColdStorage.findAll({
      attributes: [
        "userId",
        "onBoardedBy",
        "ownerName",
        "village",
        "district",
        "state",
      ],
    });
    const traders = await Trader.findAll({
      attributes: [
        "userId",
        "onBoardedBy",
        "fullName",
        "cityOrVillage",
        "district",
        "state",
      ],
    });

    const inserts = [];

    farmers.forEach((f) => {
      if (f.userId && f.onBoardedBy) {
        inserts.push({
          userId: f.userId,
          agentId: f.onBoardedBy,
          userType: USER_TYPE.FARMER,
          userName: f.name,
          village: f.village,
          district: f.district,
          state: f.state,
          statusOfRegistration: REGISTRATION_STATUS.PENDING,
        });
      }
    });

    coldstorages.forEach((c) => {
      if (c.userId && c.onBoardedBy) {
        inserts.push({
          userId: c.userId,
          agentId: c.onBoardedBy,
          userType: USER_TYPE.COLD_STORAGE,
          userName: c.ownerName,
          village: c.village,
          district: c.district,
          state: c.state,
          statusOfRegistration: REGISTRATION_STATUS.PENDING,
        });
      }
    });

    traders.forEach((t) => {
      if (t.userId && t.onBoardedBy) {
        inserts.push({
          userId: t.userId,
          agentId: t.onBoardedBy,
          userType: USER_TYPE.TRADER,
          userName: t.fullName,
          village: t.cityOrVillage,
          district: t.district,
          state: t.state,
          statusOfRegistration: REGISTRATION_STATUS.PENDING,
        });
      }
    });

    await AgentOnboardedUser.bulkCreate(inserts, { ignoreDuplicates: true });
    console.log("Backfill successfull :", inserts.length, "records inserted.");
  } catch (err) {
    console.error("Backfill failed:", err);
  }
};

backfillAgentOnboardedUsers();
