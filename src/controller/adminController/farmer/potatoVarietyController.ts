import {
  addPotatoVarietyService,
  deletePotatoVarietyService,
  getPotatoVarietyService,
  updatePotatoVarietyService,
} from "../../../services/adminServices/farmer/potatoVarietyService";

export const addPotatoVarietyGrown = async (req, res) => {
  try {
    const { role } = req.user;

    const potatoVariety = req.body;

    if (role !== "admin")
      return res.status(403).json({
        message: "Only Admin are authorized to add Potato Variety.",
      });

    const response = await addPotatoVarietyService(potatoVariety);

    if (response.success)
      return res
        .status(200)
        .json({ message: "New Potato Variety added Successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to add Potato Variety." });
  }
};

export const getPotatoVarietyGrown = async (req, res) => {
  try {
    const response = await getPotatoVarietyService();

    if (response.success)
      return res.status(200).json({ message: response.data });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve Potato Variety.",
    });
  }
};

export const updatePotatoVariety = async (req, res) => {
  try {
    const data = req.body;
    const id = req.params.id;

    const { role } = req.user;

    if (role !== "admin")
      return res.status(403).json({
        message: "Only Admin are authorized to update Potato Variety.",
      });

    const response = await updatePotatoVarietyService(data, id);

    if (response.success)
      return res
        .status(200)
        .json({ message: "Potato Variety updated successfully." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to update Potato Variety.",
    });
  }
};

export const deletePotatoVariety = async (req, res) => {
  try {
    const id = req.params.id;

    const { role } = req.user;

    if (role !== "admin")
      return res.status(403).json({
        message: "Only Admin are authorized to delete Potato Variety.",
      });

    const response = await deletePotatoVarietyService(id);

    if (response.success)
      return res
        .status(200)
        .json({ message: "Potato Variety deleted successfully." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to delete Potato Variety.",
    });
  }
};
