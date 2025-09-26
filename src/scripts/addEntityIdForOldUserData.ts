import AgentOnboardedUser, {
  USER_TYPE,
} from "../database/models/agentOnboardedUsers";
import ColdStorage from "../database/models/coldStorage";
import Farmer from "../database/models/farmer";
import Trader from "../database/models/trader/trader";

const addEntityIdForOldUser = async () => {
  try {
    const agentOnboardedData = await AgentOnboardedUser.findAll({
      where: { entityId: null },
    });

    const mappedData = await Promise.all(
      agentOnboardedData.map(async (d) => {
        let id = null;

        if (d.userType === USER_TYPE.FARMER) {
          const farmerData = await Farmer.findOne({
            where: { userId: d.userId },
          });
          id = farmerData?.id;
        } else if (d.userType === USER_TYPE.COLD_STORAGE) {
          const coldstorageData = await ColdStorage.findOne({
            where: { userId: d.userId },
          });
          id = coldstorageData?.id;
        } else {
          const traderData = await Trader.findOne({
            where: { userId: d.userId },
          });
          id = traderData?.id;
        }

        return {
          userType: d.userType,
          userId: d.userId,
          entityId: id,
        };
      })
    );

    for (const d of mappedData) {
      if (d.entityId) {
        await AgentOnboardedUser.update(
          { entityId: d.entityId },
          {
            where: {
              userId: d.userId,
              userType: d.userType,
            },
          }
        );
      }
    }

    console.log("Entity IDs updated successfully!");
  } catch (error) {
    console.error("Error updating entity IDs:", error);
  }
};

addEntityIdForOldUser();
