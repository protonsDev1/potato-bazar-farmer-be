import {
  addBiggestChallengeInSellingService,
  deleteBiggestChallengeInSellingService,
  getBiggestChallengeInSellingService,
  updateBiggestChallengeInSellingService,
} from "../../../services/adminServices/farmer/biggestChallengeInSelling";

export const addBiggestChallengeInSelling = async (req, res) => {
  try {
    const { role } = req.user;

    const biggestChallenge = req.body;

    if (role !== "admin")
      return res.status(403).json({
        message:
          "Only Admin are authorized to add Biggest Challenge in Selling.",
      });

    const response = await addBiggestChallengeInSellingService(
      biggestChallenge
    );

    if (response.success)
      return res.status(200).json({
        message: "New Biggest Challenge in Selling added Successfully.",
      });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to add Biggest Challenge in Selling.",
    });
  }
};

export const getBiggestChallengeInSelling = async (req, res) => {
  try {
    const response = await getBiggestChallengeInSellingService();

    if (response.success)
      return res.status(200).json({ message: response.data });
  } catch (error) {
    return res.status(500).json({
      message:
        error.message || "Failed to retrieve Biggest Challenge in Selling.",
    });
  }
};

export const updateBiggestChallengeInSelling = async (req, res) => {
  try {
    const data = req.body;
    const id = req.params.id;

    const { role } = req.user;

    if (role !== "admin")
      return res.status(403).json({
        message:
          "Only Admin are authorized to update Biggest Challenge in Selling.",
      });

    const response = await updateBiggestChallengeInSellingService(data, id);

    if (response.success)
      return res.status(200).json({
        message: "Biggest Challenge in Selling updated Successfully.",
      });
  } catch (error) {
    return res.status(500).json({
      message:
        error.message || "Failed to update Biggest Challenge in Selling.",
    });
  }
};

export const deleteBiggestChallengeInSelling = async (req, res) => {
  try {
    const id = req.params.id;

    const { role } = req.user;

    if (role !== "admin")
      return res.status(403).json({
        message:
          "Only Admin are authorized to delete Biggest Challenge in Selling.",
      });

    const response = await deleteBiggestChallengeInSellingService(id);
    if (response.success)
      return res.status(200).json({
        message: "Biggest Challenge in Selling deleted Successfully.",
      });
  } catch (error) {
    return res.status(500).json({
      message:
        error.message || "Failed to delete Biggest Challenge in Selling.",
    });
  }
};
