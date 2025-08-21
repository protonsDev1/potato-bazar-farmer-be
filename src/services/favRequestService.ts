import FavouriteRequest from "../database/models/favouriteRequest";
import BuyRequest from "../database/models/buyRequest";
import SellRequest from "../database/models/sellRequest";

interface ToggleFavouritePayload {
  userId: number;
  type: "buy" | "sell";
  requestId: number;
}

export const toggleFavouriteService = async ({
  userId,
  type,
  requestId,
}: ToggleFavouritePayload) => {
  let whereClause: any = { userId };

  if (type === "buy") {
    const exists = await BuyRequest.findByPk(requestId);
    if (!exists) {
      return {
        success: false,
        statusCode: 404,
        message: "Buy request not found",
      };
    }
    whereClause.buyRequestId = requestId;
  } else if (type === "sell") {
    const exists = await SellRequest.findByPk(requestId);
    if (!exists) {
      return {
        success: false,
        statusCode: 404,
        message: "Sell request not found",
      };
    }
    whereClause.sellRequestId = requestId;
  } else {
    return {
      success: false,
      statusCode: 400,
      message: "Invalid type. Must be 'buy' or 'sell'.",
    };
  }

  // Check if already favourited
  const favourite = await FavouriteRequest.findOne({ where: whereClause });

  if (favourite) {
    await favourite.destroy();
    return {
      success: true,
      statusCode: 200,
      message: `${type} request removed from favourites successfully`,
    };
  }

  // Add favourite
  const newFav = await FavouriteRequest.create(whereClause);
  return {
    success: true,
    statusCode: 201,
    message: `${type} request added to favourites successfully`,
    data: newFav,
  };
};
