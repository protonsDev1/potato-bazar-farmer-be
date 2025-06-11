import {
  addSoilTypeService,
  deleteSoilTypeService,
  getSoilTypeService,
  updateSoilTypeService,
} from "../../services/adminService/soilTypeService";

export const addSoilType = async (req, res) => {
  try {
    const { role } = req.user;

    const soilType = req.body;

    if (role !== "admin")
      return res.status(403).json({
        message: "Only Admin are authorized to add soil types.",
      });

    const response = await addSoilTypeService(soilType);

    if (response.success)
      return res
        .status(200)
        .json({ message: "New Soil Type added Successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to add soil type." });
  }
};

export const getSoilType = async (req, res) => {
  try {
    const response = await getSoilTypeService();

    if (response.success)
      return res.status(200).json({ message: response.data });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to retrieve soil type." });
  }
};

export const updateSoilType = async (req, res) => {
  try {
    const data = req.body;
    const id = req.params.id;

    const { role } = req.user;

    if (role !== "admin")
      return res.status(403).json({
        message: "Only Admin are authorized to update soil type.",
      });

    const response = await updateSoilTypeService(data, id);

    if (response.success)
      return res
        .status(200)
        .json({ message: " Soil Type updated Successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to update soil type." });
  }
};

export const deleteSoilType = async (req, res) => {
  try {
    const id = req.params.id;

    const { role } = req.user;

    if (role !== "admin")
      return res.status(403).json({
        message: "Only Admin are authorized to delete soil type.",
      });

    const response = await deleteSoilTypeService(id);
    if (response.success)
      return res
        .status(200)
        .json({ message: " Soil Type deleted Successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to delete soil type." });
  }
};
