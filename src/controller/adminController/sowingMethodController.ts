import {
  addSowingMethodService,
  deleteSowingMethodService,
  getSowingMethodService,
  updateSowingMethodService,
} from "../../services/adminService/sowingMethodService";

export const addSowingMethod = async (req, res) => {
  try {
    const { role } = req.user;

    const sowingMethod = req.body;

    if (role !== "admin")
      return res.status(403).json({
        message: "Only Admin are authorized to add Sowing Method.",
      });

    const response = await addSowingMethodService(sowingMethod);

    if (response.success)
      return res
        .status(200)
        .json({ message: "New Sowing Method added Successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to add Sowing Method." });
  }
};

export const getSowingMethod = async (req, res) => {
  try {
    const response = await getSowingMethodService();

    if (response.success)
      return res.status(200).json({ message: response.data });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to retrieve Sowing Method." });
  }
};

export const updateSowingMethod = async (req, res) => {
  try {
    const data = req.body;
    const id = req.params.id;

    const { role } = req.user;

    if (role !== "admin")
      return res.status(403).json({
        message: "Only Admin are authorized to update Sowing Method.",
      });

    const response = await updateSowingMethodService(data, id);

    if (response.success)
      return res
        .status(200)
        .json({ message: " Sowing Method updated Successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to update Sowing Method." });
  }
};

export const deleteSowingMethod = async (req, res) => {
  try {
    const id = req.params.id;

    const { role } = req.user;

    if (role !== "admin")
      return res.status(403).json({
        message: "Only Admin are authorized to delete Sowing Method.",
      });

    const response = await deleteSowingMethodService(id);
    if (response.success)
      return res
        .status(200)
        .json({ message: " Sowing Method deleted Successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to delete Sowing Method." });
  }
};
