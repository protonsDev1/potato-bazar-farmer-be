import { toggleFavouriteService } from "../services/favRequestService";

export const toggleFavourite = async (req, res) => {
  try {
    const { type, id } = req.params;
    const userId = req.user.id;

    const result = await toggleFavouriteService({
      userId,
      type,
      requestId: Number(id),
    });

    return res.status(result.statusCode).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
