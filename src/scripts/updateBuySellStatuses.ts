import BuyRequest, { BUY_REQUEST_STATUS } from "../database/models/buyRequest";
import sequelize from "../database/models/db";
import SellRequest, {
  SELL_REQUEST_STATUS,
} from "../database/models/sellRequest";

const updateStatuses = async () => {
  try {
    await sequelize.authenticate();
    console.log("DB connected");

    const [updatedCount] = await BuyRequest.update(
      { status: BUY_REQUEST_STATUS.PENDING },
      { where: { status: "Pending" } }
    );

    console.log(
      `Updated ${updatedCount} buy request(s) from 'Pending' to '${BUY_REQUEST_STATUS.PENDING}'`
    );

    const [updatedSellCount] = await SellRequest.update(
      { status: SELL_REQUEST_STATUS.PENDING },
      { where: { status: "Available" } }
    );

    console.log(
      `Updated ${updatedSellCount} SellRequest(s) from 'Available' to '${SELL_REQUEST_STATUS.PENDING}'`
    );
    process.exit(0);
  } catch (err) {
    console.error("Error updating buy requests:", err);
    process.exit(1);
  }
};

updateStatuses();
