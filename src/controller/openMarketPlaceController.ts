import job from "../database/models/job";
import LikeOpenMarketPlace from "../database/models/likeOpenMarket";
import { NotificationType } from "../database/models/notification";
import OpenMarketPlace, {
  OPEN_MARKET_STATUS,
} from "../database/models/openMarketPlace";
import { sendNotificationService } from "../services/notificationService";
import {
  createOpenMarketPlaceService,
  getOpenMarketPlacesService,
  updateOpenMarketPlaceService,
} from "../services/openMarketPlaceService";
import { parseFilters } from "../utils/parseQuery";

export const createOpenMarketPlace = async (req, res) => {
  try {
    const { id: userId } = req.user;

    req.body.createdBy = userId;

    const response = await createOpenMarketPlaceService(req.body);

    return res.status(201).json({
      success: true,
      message: "Open Market Places created successfully.",
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error in creating open market place.",
    });
  }
};

export const getOpenMarketPlacesListing = async (req, res) => {
  try {
    const {
      page = 1,
      perPage = 10,
      category,
      subCategory,
      state,
      district,
      status,
      listingType = "all",
      isFavourite,
      search,
    } = req.query;
    const { id: userId } = req.user;

    const filters = parseFilters(req.query);

    const response = await getOpenMarketPlacesService(
      userId,
      page,
      perPage,
      filters,
      category,
      subCategory,
      state,
      district,
      status,
      listingType,
      isFavourite,
      search,
    );

    return res.status(200).json({
      success: true,
      message: "Retrived open market places successfully.",
      data: response,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error in retrieving open market places.",
    });
  }
};

export const getOpenMarketPlaceById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const place = await OpenMarketPlace.findByPk(id);

    if (!place) {
      return res.status(404).json({
        success: false,
        message: "Open Market Place record not found.",
      });
    }

    const [likeCount, likedRecord] = await Promise.all([
      LikeOpenMarketPlace.count({
        where: { marketId: place.id },
      }),
      userId
        ? LikeOpenMarketPlace.findOne({
            where: {
              userId,
              marketId: place.id,
            },
          })
        : null,
    ]);

    return res.status(200).json({
      success: true,
      message: "Retrieved open market place detail page successfully.",
      data: {
        ...place.toJSON(),
        isLiked: !!likedRecord,
        likeCount,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error.message || "Error in retrieving open market place detail page.",
    });
  }
};

export const updateStatusForOpenMarketPlace = async (req, res) => {
  try {
    const { status, id, reason } = req.body;

    const response = await OpenMarketPlace.findByPk(id);
    if (!response)
      return res.status(404).json({
        success: false,
        message: "Open Market Place record not found.",
      });

    if (status === OPEN_MARKET_STATUS.REJECTED) {
      await OpenMarketPlace.update({ status, reason }, { where: { id } });
    } else await OpenMarketPlace.update({ status }, { where: { id } });

     await sendNotificationService({
          title: `Your Open Market Place is ${status}`,
          description:
            status === OPEN_MARKET_STATUS.APPROVED
              ? "Your open market place has been approved!"
              : `Your open market place was rejected. Reason: ${reason}`,
          senderId: req.user.id,
          receiverId: Number(response.createdBy),
          referenceType: NotificationType.OPEN_MARKET_PLACES,
          referenceId: response.id,
        });


    return res.status(200).json({
      success: true,
      message: `Open Market Place has been successfully ${status}.`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error.message || "Error in updating status for open market place.",
    });
  }
};

export const deleteOpenMarketPlace = async (req, res) => {
  try {
    const record = await OpenMarketPlace.findByPk(req.params.id);
    if (!record)
      return res.status(404).json({
        success: false,
        message: "Open Market Place record not found.",
      });

    await record.destroy();

    return res.status(200).json({
      success: true,
      message: "Open Market Place record deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error in deleting open market place.",
    });
  }
};

export const likeOrDislikeOpenMarketPlace = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const marketId = Number(req.params.id);

    const isValidOpenMarketPlace = await OpenMarketPlace.findByPk(marketId);

    if (!isValidOpenMarketPlace)
      return {
        success: false,
        error: "Open Market Place not found!",
      };

    const isExistingOpenMarketPlaceLiked = await LikeOpenMarketPlace.findOne({
      where: { userId, marketId },
    });

    if (isExistingOpenMarketPlaceLiked) {
      await LikeOpenMarketPlace.destroy({ where: { userId, marketId } });
      return res.status(200).json({
        succces: true,
        message: "Open Market Place un-liked successfully!",
      });
    } else {
      await LikeOpenMarketPlace.create({ userId, marketId });
      return res.status(200).json({
        success: true,
        message: "Open Market Place liked successfully!",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error in like or dislike open market place.",
    });
  }
};

export const updateOpenMarketPlace = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const updatedRecord = await updateOpenMarketPlaceService(
      Number(id),
      userId,
      req.body,
    );

    if (!updatedRecord.success) {
      return res.status(updatedRecord.statusCode).json({
        success: false,
        message: updatedRecord.error,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Open Market Place updated successfully.",
      data: updatedRecord,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error in updating open market place.",
    });
  }
};
