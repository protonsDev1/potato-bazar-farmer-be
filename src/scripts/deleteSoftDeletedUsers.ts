import { Op } from "sequelize";
import AgentOnboardedUser from "../database/models/agentOnboardedUsers";
import ColdStorage from "../database/models/coldStorage";
import Farmer from "../database/models/farmer";
import Trader from "../database/models/trader/trader";
import User, { USER_ROLES } from "../database/models/user";

const deletePermanentlySoftDeletedUser = async () => {
  await Farmer.destroy({ where: { isDeleted: true } });
  await ColdStorage.destroy({ where: { isDeleted: true } });
  await Trader.destroy({ where: { isDeleted: true } });
  await AgentOnboardedUser.destroy({ where: { isDeleted: true } });

  const farmerUserIds = (
    await Farmer.findAll({ attributes: ["userId"], raw: true })
  ).map((u) => u.userId);

  const coldStorageUserIds = (
    await ColdStorage.findAll({ attributes: ["userId"], raw: true })
  ).map((u) => u.userId);

  const traderUserIds = (
    await Trader.findAll({ attributes: ["userId"], raw: true })
  ).map((u) => u.userId);

  const validUserIds = new Set([
    ...farmerUserIds,
    ...coldStorageUserIds,
    ...traderUserIds,
  ]);

  await User.destroy({
    where: {
      role: USER_ROLES.USER,
      id: {
        [Op.notIn]: Array.from(validUserIds),
      },
    },
  });
};

deletePermanentlySoftDeletedUser();
