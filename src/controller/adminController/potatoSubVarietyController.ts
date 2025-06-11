import {
  addPotatoSubVarietyService,
  deletePotatoSubVarietyService,
  getPotatoSubVarietyService,
  updatePotatoSubVarietyService,
} from "../../services/adminService/potatoSubVarietyService";

export const addPotatoSubVarietyGrown = async (req, res) => {
  try {
    const { role } = req.user;

    const potatoSubVariety = req.body;

    if (role !== "admin")
      return res.status(403).json({
        message: "Only Admin are authorized to add Potato Sub Variety.",
      });

    const response = await addPotatoSubVarietyService(potatoSubVariety);

    if (response.success)
      return res
        .status(200)
        .json({ message: "New Potato Sub Variety added Successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to add Potato Sub Variety." });
  }
};

export const getPotatoSubVarietyGrown = async (req, res) => {
  try {
    const response = await getPotatoSubVarietyService();

    if (response.success)
      return res.status(200).json({ message: response.data });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve Potato Sub Variety.",
    });
  }
};

export const updatePotatoSubVariety = async (req, res) => {
  try {
    const data = req.body;
    const id = req.params.id;

    const { role } = req.user;

    if (role !== "admin")
      return res.status(403).json({
        message: "Only Admin are authorized to update Potato Sub Variety.",
      });

    const response = await updatePotatoSubVarietyService(data, id);

    if (response.success)
      return res
        .status(200)
        .json({ message: "Potato Sub Variety updated successfully." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to update Potato Sub Variety.",
    });
  }
};

export const deletePotatoSubVariety = async (req, res) => {
  try {
    const id = req.params.id;

    const { role } = req.user;

    if (role !== "admin")
      return res.status(403).json({
        message: "Only Admin are authorized to delete Potato Sub Variety.",
      });

    const response = await deletePotatoSubVarietyService(id);

    if (response.success)
      return res
        .status(200)
        .json({ message: "Potato Sub Variety deleted successfully." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to delete Potato Sub Variety.",
    });
  }
};
